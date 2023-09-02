'use strict';

const Controller = require('egg').Controller;


/**
 * task Controller
 */
class CallbackController extends Controller {
  /**
   * 华为回调
   */
  async huawei() {
    const { ctx, logger } = this;
    logger('【华为回调】内容：', ctx.request.body);
    ctx.body = { code: 0, message: 'success' };
  }
}

module.exports = CallbackController;
