/* eslint valid-jsdoc: "off" */

'use strict';

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
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

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

  return {
    ...config,
    ...userConfig,
  };
};
