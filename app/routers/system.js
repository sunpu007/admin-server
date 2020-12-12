'use strict';

module.exports = app => {
  const { router, controller, config } = app;
  const checkTokenHandler = app.middleware.checkTokenHandler();

  // 获取管理员账号
  router.get(`${config.contextPath}/system/admin/list`, checkTokenHandler, controller.system.adminList);
  // 编辑/新增管理员账号
  router.post(`${config.contextPath}/system/admin/edit`, checkTokenHandler, controller.system.editAdmin);
  // 删除管理员
  router.post(`${config.contextPath}/system/admin/delete`, checkTokenHandler, controller.system.deleteAdmin);
  // 重置管理员密码
  router.post(`${config.contextPath}/system/admin/pwd/reset`, checkTokenHandler, controller.system.resetAdminPwd);
  // 修改管理员密码
  router.post(`${config.contextPath}/system/admin/pwd/edit`, checkTokenHandler, controller.system.editAdminPwd);
};
