'use strict';

const { SCHEDULE_EXECUTION_STATUS, SCHEDULE_TRIGGER_TYPE } = require('../constants');
const { formatStr } = require('./index')

class JobHandlerLog {
  constructor(app) {
    this.app = app;
    this.ctx = app.ctx;
  }

  // 初始化日志
  async init(schedule, triggerType = SCHEDULE_TRIGGER_TYPE.TASK) {
    const result = await this.app.mysql.insert('schedule_job_log', {
      job_id: schedule.job_id,
      job_handler: schedule.jobHandler,
      job_param: schedule.params,
      trigger_type: triggerType,
      error_log: '',
      job_log: `任务触发类型：${triggerType === SCHEDULE_TRIGGER_TYPE.TASK ? 'Cron触发' : '手动触发'}<br>`,
    });
    this.id = result.insertId;
  }

  // 追加日志
  async log(logStr, ...args) {
    const content = formatStr(logStr, ...args);
    await this.app.mysql.query('UPDATE schedule_job_log SET job_log = CONCAT(job_log, ?) WHERE id = ?', [ `${content}<br/>`, this.id ]);
  }

  // 记录执行异常日志
  async error(logStr, ...args) {
    const errorMsg = formatStr(logStr, ...args);
    await this.app.mysql.query('UPDATE schedule_job_log SET job_status = -1, error_log = ? WHERE id = ?', [ errorMsg, this.id ]);
  }

  // 定时任务执行结束
  async end() {
    await this.app.mysql.update('schedule_job_log', { execution_status: SCHEDULE_EXECUTION_STATUS.END }, { where: { id: this.id } });
  }
}

module.exports = JobHandlerLog;
