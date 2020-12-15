'use strict';

const { Service } = require("egg");

class ScheduleService extends Service {
  /**
   * 测试
   */
  async testHandler() {
    await this.logger.info('我是测试任务');
  }
}

module.exports = ScheduleService;
