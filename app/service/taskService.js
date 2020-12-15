'use strict';

const { Service } = require('egg');
const { SCHEDULE_STATUS } = require('../constants');

/**
 * task Service
 */
class TaskService extends Service {
  // 定时任务管理
  async scheduleList({ page = 1, size = 20 }) {
    const limit = parseInt(size),
      offset = parseInt(page - 1) * parseInt(size);

    const [ list, total ] = await Promise.all([
      this.app.mysql.select('schedule_job', {
        orders: [[ 'create_time', 'desc' ]],
        limit,
        offset,
      }),
      this.app.mysql.count('schedule_job'),
    ]);
    return { list, total };
  }
  // 修改/新增定时任务
  async editSchedule(userName, { job_id, cron, jobName, jobHandler, params = '', description = '' }) {
    if (!job_id) {
      // 新增
      await this.app.mysql.insert('schedule_job', {
        cron,
        jobName,
        jobHandler,
        description,
        params,
        create_by: userName,
        update_by: userName,
        create_time: new Date(),
        update_time: new Date(),
      });
      return;
    }
    // 修改
    await this.app.mysql.update('schedule_job', {
      cron,
      jobName,
      jobHandler,
      description,
      params,
      update_by: userName,
      update_time: new Date(),
    }, { where: { job_id } });

    const schedule = await this.app.mysql.get('schedule_job', { job_id });

    // 此处在版本允许的情况下可使用可选链操作符`?`
    if (schedule && schedule.status === SCHEDULE_STATUS.RUN) {
      // 启动状态下重置任务
      await this.ctx.helper.cancelSchedule(jobName);
      await this.ctx.helper.generateSchedule(cron, jobName, jobHandler);
    }
  }
  // 删除定时任务
  async deleteSchedule({ job_id }) {
    await this.app.mysql.delete('schedule_job', { job_id });
  }
  // 更新定时任务状态
  async updateStatusSchedule({ job_id, status }) {
    await this.app.mysql.update('schedule_job', { status }, { where: { job_id } });
    const schedule = await this.app.mysql.get('schedule_job', { job_id });
    if (schedule !== null) {
      if (status === SCHEDULE_STATUS.RUN) {
        // 启动任务
        await this.ctx.helper.generateSchedule(schedule.cron, schedule.jobName, schedule.jobHandler);
      } else {
        // 停止任务
        await this.ctx.helper.cancelSchedule(schedule.jobName);
      }
    }
  }
  // 执行任务
  async runSchedule({ job_id }) {
    const schedule = await this.app.mysql.get('schedule_job', { job_id });
    if (schedule === null) throw new VideoError(RESULT_FAIL, '任务不存在');

    // 执行任务
    this.service.scheduleService[schedule.jobHandler]();
  }
}

module.exports = TaskService;
