'use strict';

const { formatStr } = require('./index')

class JobHandlerLog {
  constructor(app) {
    this.app = app;
    this.ctx = app.ctx;
  }

  // 初始化日志
  async init(schedule) {
    const result = await this.app.mysql.insert('schedule_job_log', {
      job_id: schedule.job_id, job_handler: schedule.jobHandler, job_param: schedule.params });
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
    await this.app.mysql.query('UPDATE schedule_job_log SET job_status = -1 AND error_log = ? WHERE id = ?', [ errorMsg, this.id ]);
  }
}

module.exports = JobHandlerLog;