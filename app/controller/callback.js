'use strict';

const Controller = require('egg').Controller;

const { setResult } = require('../utils');

/**
 * task Controller
 */
class CallbackController extends Controller {
  /**
   * 华为回调
   */
  async huawei() {
    const { ctx } = this;
    ctx.app.logger('【华为回调】内容：', ctx.request.body);
    ctx.body = { code: 0, message: 'success' };
  }
}

module.exports = CallbackController;
