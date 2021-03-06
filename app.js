'use strict';

const { SCHEDULE_STATUS } = require('./app/constants');

class AppBootHook {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  async willReady() {
    await this.app.logger.info('【初始化定时任务】开始...');
    // 查询启动状态的定时任务
    const schedules = await this.app.mysql.select('schedule_job', { where: { status: SCHEDULE_STATUS.RUN } });
    // 循环注册定时任务
    schedules.forEach(async schedule => {
      await this.app.logger.info('【注册job】name：%s, handler: %s', schedule.jobName, schedule.jobHandler);
      await this.ctx.helper.generateSchedule(schedule.job_id, schedule.cron, schedule.jobName, schedule.jobHandler);
    });
    await this.app.logger.info('【初始化定时任务】初始化定时任务: %d，结束...', schedules.length);
  }

  async beforeClose() {
    await this.app.logger.info('【销毁定时任务】开始...');
    const scheduleStacks = await this.app.scheduleStacks;
    Reflect.ownKeys(scheduleStacks).forEach(async key => {
      await this.ctx.helper.cancelSchedule(key);
    });
    await this.app.logger.info('【销毁定时任务】销毁定时任务数: %d，结束...', Reflect.ownKeys(scheduleStacks).length);
  }
}

module.exports = AppBootHook;
