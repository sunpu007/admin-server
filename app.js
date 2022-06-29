'use strict';

const { SCHEDULE_STATUS, SCHEDULE_DELETE, ACTIVE_KYES } = require('./app/constants');

class AppBootHook {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  async willReady() {
    await this.app.logger.info('【初始化定时任务】开始...');
    // 查询启动状态的定时任务
    const schedules = await this.app.mysql.select('schedule_job', { where: { status: SCHEDULE_STATUS.RUN, is_delete: SCHEDULE_DELETE.MANUAL } });
    // 循环注册定时任务
    schedules.forEach(async schedule => {
      await this.app.logger.info('【注册job】name：%s, handler: %s', schedule.jobName, schedule.jobHandler);
      await this.ctx.helper.generateSchedule(schedule.job_id, schedule.cron, schedule.jobName, schedule.jobHandler);
    });
    await this.app.logger.info('【初始化定时任务】初始化定时任务: %d，结束...', schedules.length);

    /**
     * 监听取消/停止任务
     * data: 传入任务信息
     */
    this.app.messenger.on(ACTIVE_KYES.STOP_SCHEDULS, async data => {
      await this.app.logger.info('【任务通知】收到取消任务通知，任务名：', data.jobName);
      // 取消任务
      await this.ctx.helper.cancelSchedule(data.jobName);
    });

    /**
     * 监听取消/停止任务
     * data: 传入任务信息
     */
    this.app.messenger.on(ACTIVE_KYES.RUN_SCHEDULS, async data => {
      await this.app.logger.info('【任务通知】收到启动任务通知，任务名：', data.jobName);
      // 取消任务
      await this.ctx.helper.generateSchedule(data.job_id, data.cron, data.jobName, data.jobHandler);
    });
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
