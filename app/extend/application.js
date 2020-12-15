'use strict';

const REDLOCK = Symbol('Application#redlock');

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
};
