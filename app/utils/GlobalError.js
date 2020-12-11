'use strict';

/**
 * 自定义异常
 * @param {*} code 异常状态吗
 * @param {*} msg 异常信息
 */
function GlobalError(code, msg) {
  this.code = code;
  this.messages = msg;
}
GlobalError.prototype = Object.create(Error.prototype);
GlobalError.prototype.constructor = GlobalError;

module.exports = GlobalError;
