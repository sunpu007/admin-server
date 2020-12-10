'use strict';

const VideoError = require('../utils/VideoError');
const { setResult } = require('../utils');
const { RESULT_FAIL } = require('../constants/result');

/**
 * 全局异常处理
 */
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      /** 自定义异常 */
      if (err instanceof VideoError) {
        ctx.body = setResult(err);
        return false;
      }
      /** 运行异常 */
      // 记录一条错误日志
      ctx.app.emit('error', err, ctx);
      ctx.body = setResult(RESULT_FAIL, '服务器繁忙');
    }
  };
};
