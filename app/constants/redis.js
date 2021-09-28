'use strict';

const REDIS = {
  // token存储前缀
  ADMIN_PREFIX: 'admin:',
  // token有效期
  ADMIN_EXPIRE_TIME: 3600,
  // 任务调度记录前缀 scheduleStacks
  SCHEDULE_STACKS: 'schedule_stacks:'
};

module.exports = REDIS;
