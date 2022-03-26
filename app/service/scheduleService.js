'use strict';

const { Service } = require('egg');

class ScheduleService extends Service {
  /**
   * 测试处理程序
   * @param {*} params 任务参数
   * @param {*} jobHandlerLog 日志
   */
  async testHandler(params, jobHandlerLog) {
    // 此处替换成具体业务代码
    await this.logger.info('我是测试任务，任务参数: %s', params);
    await jobHandlerLog.log('我是测试任务，任务参数: {0}', params);
  }
  /**
   * 测试调用接口任务
   * @param {*} params 任务参数
   * @param {*} jobHandlerLog 日志
   */
  async testCurlHandler(params, jobHandlerLog) {
    // 获取参数
    const paramsObj = JSON.parse(params);
    const result = await this.ctx.curl(paramsObj.url, {
      method: paramsObj.method,
      data: paramsObj.data,
      dataType: 'json',
    });
    await jobHandlerLog.log('测试调用接口任务，状态码：{0}', result.status);
    await jobHandlerLog.log('测试调用接口任务，响应数据：{0}', JSON.stringify(result.data));
  }
}

module.exports = ScheduleService;
