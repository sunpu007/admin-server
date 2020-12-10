'use strict';

/**
 * 接口日志打印
 */
module.exports = () => {
  return async function logHandler(ctx, next) {
    const time = Date.now();
    const { body, url, method } = ctx.request;
    await next();
    let infoStr = `url: ${url}, method: ${method}, `;
    if (url.startsWith('/page') || ctx.response.header['content-type'] === 'application/octet-stream') {
      infoStr += `params: ${JSON.stringify(body)}, time: ${Date.now() - time}ms`;
    } else {
      infoStr += `params: ${JSON.stringify(body)}, resp: ${JSON.stringify(ctx.body)}, time: ${Date.now() - time}ms`;
    }
    ctx.logger.info(infoStr);
  };
};
