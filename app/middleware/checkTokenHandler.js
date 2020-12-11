'use strict';

const { ADMIN_PREFIX, ADMIN_EXPIRE_TIME } = require("../constants/redis");
const { RESULT_LOGIN_FAIL } = require("../constants/result");
const GlobalError = require("../utils/GlobalError");

module.exports = () => {
  return async function(ctx, next) {
    const { headers } = ctx.request;
    const { token } = headers;

    let adminInfo = await ctx.app.redis.get(ADMIN_PREFIX + token);
    if (!adminInfo) throw new GlobalError(RESULT_LOGIN_FAIL, '登陆超时，请重新登陆');

    // 延长token的失效时间
    await ctx.app.redis.expire(ADMIN_PREFIX + token, ADMIN_EXPIRE_TIME);

    adminInfo = JSON.parse(adminInfo);
    headers.adminId = adminInfo.adminId;
    headers.username = adminInfo.username;
    headers.avatarUrl = adminInfo.avatarUrl;

    await next();
  }
};
