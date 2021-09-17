'use strict';

const schedule = require('node-schedule');
const JobHandlerLog = require('../utils/JobHandlerLog');

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
    this.app.scheduleStacks[jobName] = schedule.scheduleJob(cron, async () => {
      // 读取锁,保证一个任务同时只能有一个进程执行
      const locked = await this.app.redlock.lock('sendAllUserBroadcast:' + id, 'sendAllUserBroadcast', 180);
      if (!locked) return false;

      const jobHandlerLog = new JobHandlerLog(this.app);

      try {
        // 获取任务信息
        const schedule = await this.app.mysql.get('schedule_job', { job_id: id });

        // 执行日志初始化
        await jobHandlerLog.init(schedule)

        // 调用任务方法
        await this.service.scheduleService[jobHandler](schedule.params, jobHandlerLog);
      } catch (error) {
        await this.logger.info('执行任务`%s`失败，时间：%s, 错误信息：%j', jobName, new Date().toLocaleString(), error);
        // 记录失败日志
        await jobHandlerLog.error('执行任务`{0}`失败，时间：{1}, 错误信息：{2}', jobName, new Date().toLocaleString(), error);
      } finally {
        // 释放锁
        await this.app.redlock.unlock('sendAllUserBroadcast:' + id);
      }
    });
  },
  /**
   * 取消/停止定时任务
   * @param {*} jobName 任务名
   */
  async cancelSchedule(jobName) {
    this.ctx.logger.info('[取消定时任务]，任务名：%s', jobName);
    this.app.scheduleStacks[jobName] && this.app.scheduleStacks[jobName].cancel();
  },
};
