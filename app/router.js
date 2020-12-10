'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  router.get(`${config.contextPath}/`, controller.home.index);

  /**
   * 动态注册路由文件
   */
  const routerPath = path.join(__dirname, 'routers');
  (function initRouter(pathUrl) {
    fs.readdirSync(pathUrl).forEach(dir => {
      if (fs.statSync(path.join(pathUrl, dir)).isFile()) {
        require(path.join(pathUrl, dir))(app);
      } else {
        // 文件夹
        initRouter(path.join(pathUrl, dir));
      }
    });
  })(routerPath);
};
