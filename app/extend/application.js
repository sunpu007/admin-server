'use strict';

const REDLOCK = Symbol('Application#redlock');
const SCHEDULESTACKS = Symbol('Application#scheduleStacks');

/**
 * Application扩展
 */
module.exports = {
  /**
   * redis锁
   */
  get redlock() {
    if (!this[REDLOCK]) {
      this[REDLOCK] = {};
      this[REDLOCK].lock = async (key, value, ttl) => {
        return await this.redis.set(key, value, 'EX', ttl, 'NX');
      };
      this[REDLOCK].unlock = async key => {
        return await this.redis.del(key);
      };
    }
    return this[REDLOCK];
  },
  /**
   * 用于存放定时任务的堆栈
   */
  get scheduleStacks() {
    if (!this[SCHEDULESTACKS]) {
      this[SCHEDULESTACKS] = {};
    }
    return this[SCHEDULESTACKS];
  }
};
