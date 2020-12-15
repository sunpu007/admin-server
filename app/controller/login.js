'use strict';

const { Controller } = require('egg');
const { ADMIN_PREFIX } = require('../constants/redis');
const { setResult } = require('../utils');

/**
 * 登陆相关
 */
class LoginController extends Controller {
  /**
   * 登陆
   * username:String 用户名
   * password:String 密码
   */
  async login() {
    const { ctx } = this;
    const token = await ctx.service.loginService.login(ctx.request.body);
    ctx.body = setResult({ data: { token } });
  }
  /**
   * 获取登陆详细信息
   */
  async loginInfo() {
    const { ctx } = this;
    const adminInfo = JSON.parse(await ctx.app.redis.get(ADMIN_PREFIX + ctx.query.token));
    ctx.body = setResult({ data: adminInfo });
  }
  /**
   * 登出
   */
  async logout() {
    const { ctx } = this;
    await ctx.app.redis.del(ADMIN_PREFIX + ctx.request.header.token);
    ctx.body = setResult();
  }
}

module.exports = LoginController;
