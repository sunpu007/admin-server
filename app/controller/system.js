'use strict';

const { Controller } = require("egg");
const { setResult } = require("../utils");

class SystemController extends Controller {
  /**
   * 获取管理员账号
   */
  async adminList() {
    const { ctx } = this;
    const list = await ctx.service.systemService.adminList();
    ctx.body = setResult({ data: { list } });
  }
  /**
   * 编辑/新增管理员账号
   */
  async editAdmin() {
    const { ctx } = this;
    const { username } = ctx.request.headers;
    const pwd = await ctx.service.systemService.editAdmin(username, ctx.request.body);
    ctx.body = setResult({ data: { pwd } });
  }
  /**
   * 删除管理员
   */
  async deleteAdmin() {
    const { ctx } = this;
    await ctx.service.systemService.deleteAdmin(ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 重置管理员密码
   */
  async resetAdminPwd() {
    const { ctx } = this;
    const { username } = ctx.request.headers;
    const pwd = await ctx.service.systemService.resetAdminPwd(username, ctx.request.body);
    ctx.body = setResult({ data: { pwd } });
  }
  /**
   * 修改管理员密码
   */
  async editAdminPwd() {
    const { ctx } = this;
    await ctx.service.systemService.editAdminPwd();
    ctx.body = setResult();
  }
}

module.exports = SystemController;
