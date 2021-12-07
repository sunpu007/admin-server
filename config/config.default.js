/* eslint valid-jsdoc: "off" */

'use strict';

const { setResult } = require('../app/utils');
const { RESULT_FAIL } = require('../app/constants/result');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1607609908869_9400';

  // add your middleware config here
  config.middleware = [ 'logHandler', 'errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.contextPath = '/api';

  config.proxy = true;

  /** 启动端口配置 */
  config.cluster = {
    listen: {
      port: 7002,
    },
  };

  /** 跨域，仅用于本地环境 */
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  /** mysql配置 */
  config.mysql = {
    client: {
      // host
      host: 'adminDemodb',
      // 端口号
      port: '3306',
      // 用户名
      user: 'admin_demo_user',
      // 密码
      password: 'admin2020',
      // 数据库名
      database: 'admin_demo',
    },
  };

  /** redis配置 */
  config.redis = {
    client: {
      port: 6379,
      host: 'adminDemodb',
      password: '2020redis!',
      db: 0,
    },
  };

  config.googleAuth = {
    appName: 'AdminDemo',
  };

  // 性能监控
  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: process.env.ADMIN_DEMO_ALINODE_APPID,
    secret: process.env.ADMIN_DEMO_ALINODE_APPSECRET,
  };

  /** 运行异常 */
  config.onerror = {
    all(err, ctx) {
      // 记录一条错误日志
      ctx.app.emit('error', err, ctx);
      ctx.body = setResult(RESULT_FAIL, '服务器繁忙');
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
