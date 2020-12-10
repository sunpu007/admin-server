'use strict';

/** 接口返回码: 0 成功 1 失败 */
const RESULT = {
  // 成功
  RESULT_SUCC: 0,
  // 通用失败
  RESULT_FAIL: 1,
  // 登录超时
  RESULT_LOGIN_FAIL: -1,
  // 账号封禁
  RESULT_USER_STATUS_BAN: -2,
};

module.exports = RESULT;
