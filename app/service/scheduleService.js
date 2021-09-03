'use strict';

const { Service } = require('egg');

class ScheduleService extends Service {
  /**
   * 测试处理程序
   * @param {*} params 任务参数
   */
  async testHandler(params) {
    // 此处替换成具体业务代码
    await this.logger.info('我是测试任务，任务参数: %s', params);
  }
  /**
   * 测试调用接口任务
   * @param {*} params 任务参数
   */
  async testCurlHandler(params) {
    // 获取参数
    const paramsObj = JSON.parse(params)
    const result = await this.ctx.curl(paramsObj.url, {
      method: paramsObj.method,
      data: paramsObj.data
    });
    await this.logger.info('测试调用接口任务，状态码：%d，返回值：%j', result.status);
  }
}

module.exports = ScheduleService;
