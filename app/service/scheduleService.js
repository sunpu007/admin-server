'use strict';

const { Service } = require("egg");

class ScheduleService extends Service {
  /**
   * 测试
   */
  async testHandler(id) {
    await this.logger.info('我是测试任务，任务ID：%s', id);
  }
}

module.exports = ScheduleService;
