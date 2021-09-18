'use strict';

const Controller = require('egg').Controller;

const { setResult } = require('../utils');

/**
 * task Controller
 */
class TaskController extends Controller {
  /**
   * 定时任务管理
   */
  async scheduleList() {
    const { ctx } = this;
    const result = await ctx.service.taskService.scheduleList(ctx.request.query);
    ctx.body = setResult({ data: result });
  }
  /**
   * 修改/新增定时任务
   */
  async editSchedule() {
    const { ctx } = this;
    const { username } = ctx.request.headers;
    await ctx.service.taskService.editSchedule(username, ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 删除定时任务
   */
  async deleteSchedule() {
    const { ctx } = this;
    await ctx.service.taskService.deleteSchedule(ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 更新定时任务状态
   */
  async updateStatusSchedule() {
    const { ctx } = this;
    await ctx.service.taskService.updateStatusSchedule(ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 执行任务
   */
  async runSchedule() {
    const { ctx } = this;
    await ctx.service.taskService.runSchedule(ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 获取任务执行日志
   */
  async scheduleLogList() {
    const { ctx } = this;
    const result = await ctx.service.taskService.scheduleLogList(ctx.request.query);
    ctx.body = setResult({ data: result });
  }
  /**
   * 获取任务执行日志详细信息
   */
  async scheduleLogDateil() {
    const { ctx } = this;
    const result = await ctx.service.taskService.scheduleLogDateil(ctx.request.query);
    ctx.body = setResult({ data: result });
  }
}

module.exports = TaskController;
