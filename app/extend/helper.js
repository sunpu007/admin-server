'use strict';

const fs = require('fs')
const { spawn } = require('child_process');
const schedule = require('node-schedule');
const NodeUUID = require('node-uuid');
const JobHandlerLog = require('../utils/JobHandlerLog');
const { SCHEDULE_STACKS } = require('../constants/redis');
const { SCHEDULE_STATUS, SCHEDULE_RUN_MODE, SCHEDULE_TRIGGER_TYPE } = require('../constants');

module.exports = {
  /**
   * 创建定时任务
   * @param {*} id 任务ID
   * @param {*} cron Cron
   * @param {*} jobName 任务名
   * @param {*} jobHandler 任务方法
   * 在日常使用中，可能会存在同一处理程序有不同的处理逻辑，所以需要传入任务的ID
   * 如：在消息推送中，会存在不同时间对相同用户推送不同内容，而内容存放在任务信息中，业务代码需要查询到对应的任务信息读取推送信息，处理下一步逻辑
   */
  async generateSchedule(id, cron, jobName, jobHandler) {
    this.ctx.logger.info('[创建定时任务]，任务ID: %s，cron: %s，任务名: %s，任务方法: %s', id, cron, jobName, jobHandler);
    // 生成任务唯一值
    const uuid = NodeUUID.v4();
    this.app.scheduleStacks[jobName] = schedule.scheduleJob(uuid, cron, async () => {
      await this.executeSchedule(id);
    });
    await this.app.redis.set(`${SCHEDULE_STACKS}${uuid}`, `${jobName}-${Date.now()}`);
  },
  /**
   * 取消/停止定时任务
   * @param {*} jobName 任务名
   */
  async cancelSchedule(jobName) {
    this.ctx.logger.info('[取消定时任务]，任务名：%s', jobName);
    await this.app.redis.del(`${SCHEDULE_STACKS}${this.app.scheduleStacks[jobName].name}`);
    this.app.scheduleStacks[jobName] && this.app.scheduleStacks[jobName].cancel();
  },
  /**
   * 执行任务
   * @param {*} id 任务ID
   * @param {*} checkLocked 是否单一执行
   * @param {*} checkStatus 是否判断当前状态
   * @param {*} triggerType 触发类型
   */
  async executeSchedule(id, checkLocked = true, checkStatus = true, triggerType = SCHEDULE_TRIGGER_TYPE.TASK) {
    // 读取锁,保证一个任务同时只能有一个进程执行
    if (checkLocked) {
      const locked = await this.app.redlock.lock('sendAllUserBroadcast:' + id, 'sendAllUserBroadcast', 180);
      if (!locked) return false;
    }

    const jobHandlerLog = new JobHandlerLog(this.app);

    // 获取任务信息
    const schedule = await this.app.mysql.get('schedule_job', { job_id: id });

    try {
      // 判断任务状态
      if (schedule.status === SCHEDULE_STATUS.STOP && checkStatus) {
        // 当任务处于停止状态时，取消当前执行
        // 任务容错，防止用户在调用停止接口时不是当前worker
        await this.cancelSchedule(schedule.jobName);
        await this.logger.info('执行任务`%s`时，任务状态为停止状态');
      } else {
        // 执行日志初始化
        await jobHandlerLog.init(schedule, triggerType);

        if (schedule.runMode === SCHEDULE_RUN_MODE.BEAN) {
          // 调用任务方法
          await this.service.scheduleService[schedule.jobHandler](schedule.params, jobHandlerLog);
        } else if (schedule.runMode === SCHEDULE_RUN_MODE.SHELL) {
          // 执行脚本文件
          await this.execScript(schedule, jobHandlerLog);
        }
      }
    } catch (error) {
      await this.logger.info('执行任务`%s`失败，时间：%s, 错误信息：%j', schedule.jobName, new Date().toLocaleString(), error);
      // 记录失败日志
      await jobHandlerLog.error('执行任务`{0}`失败，时间：{1}, 错误信息：{2}', schedule.jobName, new Date().toLocaleString(), error);
    } finally {
      // 释放锁
      checkLocked && await this.app.redlock.unlock('sendAllUserBroadcast:' + id);
      // 更新日志记录状态
      await jobHandlerLog.end();
    }
  },
  /**
   * 执行脚本文件
   * @param {*} schedule 任务信息
   * @param {*} jobHandlerLog 日志
   */
  async execScript(schedule, jobHandlerLog) {
    return new Promise((resolve, reject) => {
      // 创建脚本临时文件
      const filePath = '/tmp/task' + schedule.job_id + Date.now() + '.sh';
      try {
        // 写入文件
        fs.writeFileSync(filePath, schedule.runSource);
        // 处理用户参数
        const params = schedule.params.split(',');
        // 执行脚本
        const ls = spawn('/bin/bash', [ filePath, ...params ]);
        // 监听输出
        ls.stdout.on('data', data => {
          jobHandlerLog.log(data);
        });

        ls.on('close', () => {
          resolve();
        });
        // 监听异常
        ls.on('exit', code => {
          if (code !== 0) reject(new Error(code));
          fs.unlinkSync(filePath);
        });
      } catch (err) {
        fs.unlinkSync(filePath);
        throw new Error(err);
      }
    });
  },
};
