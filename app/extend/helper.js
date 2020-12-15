'use strict';

const schedule = require('node-schedule');

/**
 * 用于存放定时任务的堆栈
 */
const scheduleStacks = {};

module.exports = {
  /**
   * 获取当前在执行所有任务
   */
  async getScheduleStacks() {
    return scheduleStacks;
  },
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
    scheduleStacks[jobName] = schedule.scheduleJob(cron, () => {
      this.service.scheduleService[jobHandler](id);
    });
  },
  /**
   * 取消/停止定时任务
   * @param {*} jobName 任务名
   */
  async cancelSchedule(jobName) {
    this.ctx.logger.info('[取消定时任务]，任务名：%s', jobName);
    scheduleStacks[jobName] && scheduleStacks[jobName].cancel();
  },
};
