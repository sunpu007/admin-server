'use strict';

const schedule = require('node-schedule');

/**
 * 用于存放定时任务信息
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
