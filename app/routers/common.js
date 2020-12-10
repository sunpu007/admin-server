'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  // const checkToken = app.middleware.checkToken();

  router.get(`${config.contextPath}/test`, controller.home.index);
};
