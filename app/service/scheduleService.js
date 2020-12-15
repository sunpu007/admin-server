'use strict';

const { Service } = require("egg");

class ScheduleService extends Service {
  /**
   * 测试
   */
  async testHandler(job_id) {
    // 读取锁
    const locked = await this.app.redlock.lock('sendAllUserBroadcast:' + job_id, 'sendAllUserBroadcast', 180);
    if (!locked) return false;

    const schedule = await this.app.mysql.get('schedule_job', { job_id });
    await this.logger.info('我是测试任务，任务信息: %j', schedule);

    // 释放锁
    await this.app.redlock.unlock('sendAllUserBroadcast:' + job_id);
  }
}

module.exports = ScheduleService;
