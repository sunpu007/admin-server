'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;

  // 华为回调
  router.all(`${config.contextPath}/callback/huawei`, controller.callback.huawei);
  // vivo回调
  router.all(`${config.contextPath}/callback/vivo`, controller.callback.vivo);
  // 魅族回调
  router.all(`${config.contextPath}/callback/meizu`, controller.callback.meizu);
};
