'use strict';

const { Service } = require('egg');
const { SCHEDULE_STATUS, SCHEDULE_TRIGGER_TYPE, SCHEDULE_RUN_MODE } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');
const GlobalError = require('../utils/GlobalError');

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
  async editSchedule(userName, { job_id, cron, jobName, runMode, jobHandler = '', runSource = '', params = '', description = '' }) {
    // 判断
    // const jobInfo = await this.app.mysql.get('schedule_job', { jobHandler });
    const jobInfo = this.service.scheduleService[jobHandler];
    if (!jobInfo && runMode === SCHEDULE_RUN_MODE.BEAN) throw new GlobalError(RESULT_FAIL, '任务处理程序不存在，请重新输入');
    if (!job_id) {
      // 新增
      await this.app.mysql.insert('schedule_job', {
        cron,
        jobName,
        runMode,
        jobHandler,
        runSource,
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
    const result = await this.app.mysql.update('schedule_job', {
      cron,
      jobName,
      jobHandler,
      description,
      params,
      update_by: userName,
      update_time: new Date(),
    }, { where: { job_id } });

    if (result.affectedRows === 1) {
      const schedule = await this.app.mysql.get('schedule_job', { job_id });
      // 此处在版本允许的情况下可使用可选链操作符`?`
      if (schedule && schedule.status === SCHEDULE_STATUS.RUN) {
        // 启动状态下重置任务
        await this.ctx.helper.cancelSchedule(jobName);
        await this.ctx.helper.generateSchedule(job_id, cron, jobName, jobHandler);
      }
    }
  }
  // 删除定时任务
  async deleteSchedule({ job_id }) {
    const result = await this.app.mysql.delete('schedule_job', { job_id });
    if (result.affectedRows === 1) {
      const schedule = await this.app.mysql.get('schedule_job', { job_id });
      if (schedule.status === SCHEDULE_STATUS.RUN) {
        // 停止任务
        await this.ctx.helper.cancelSchedule(schedule.jobName);
      }
    }
  }
  // 更新定时任务状态
  async updateStatusSchedule({ job_id, status }) {
    const result = await this.app.mysql.update('schedule_job', { status }, { where: { job_id } });
    // 判断是否更新成功
    if (result.affectedRows === 1) {
      const schedule = await this.app.mysql.get('schedule_job', { job_id });
      if (status === SCHEDULE_STATUS.RUN) {
        // 启动任务
        await this.ctx.helper.generateSchedule(job_id, schedule.cron, schedule.jobName, schedule.jobHandler);
      } else {
        // 停止任务
        await this.ctx.helper.cancelSchedule(schedule.jobName);
      }
    }
  }
  // 执行任务
  async runSchedule({ job_id }) {
    const schedule = await this.app.mysql.get('schedule_job', { job_id });
    if (schedule === null) throw new GlobalError(RESULT_FAIL, '任务不存在');

    await this.ctx.helper.executeSchedule(job_id, false, false, SCHEDULE_TRIGGER_TYPE.MANUAL);
  }
  // 获取任务执行日志
  async scheduleLogList({ job_id, page = 1, size = 20 }) {
    const limit = parseInt(size),
      offset = parseInt(page - 1) * parseInt(size);

    const [ list, total ] = await Promise.all([
      this.app.mysql.query(`SELECT job.jobName jobName, log.id id, log.job_handler jobHandler, log.job_param jobParam, log.handle_time handleTime,
      log.job_status jobStatus, log.trigger_type triggerType, log.execution_status executionStatus, log.error_log errorLog FROM schedule_job job,
      schedule_job_log log WHERE job.job_id = log.job_id AND log.job_id = ? ORDER BY log.create_time DESC LIMIT ?,?`, [ job_id, offset, limit]),
      this.app.mysql.count('schedule_job_log', { job_id })
    ]);

    return { list, total };
  }
  // 获取任务执行日志详细信息
  async scheduleLogDateil({ id }) {
    const result = await this.app.mysql.get('schedule_job_log', { id })

    return { detail: result.job_log, executionStatus: result.execution_status };
  }
}

module.exports = TaskService;
