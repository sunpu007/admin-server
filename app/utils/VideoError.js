'use strict';

/**
 * 自定义异常
 * @param {*} code 异常状态吗
 * @param {*} msg 异常信息
 */
function VideoError(code, msg) {
  this.code = code;
  this.messages = msg;
}
VideoError.prototype = Object.create(Error.prototype);
VideoError.prototype.constructor = VideoError;

module.exports = VideoError;
