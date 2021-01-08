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
  /** ** 菜单管理 ****/
  // 获取菜单列表
  router.get(`${config.contextPath}/system/menu/list`, checkTokenHandler, controller.system.menuList);
  // 编辑菜单
  router.post(`${config.contextPath}/system/menu/edit`, checkTokenHandler, controller.system.editMenu);
  // 删除菜单
  router.post(`${config.contextPath}/system/menu/delete`, checkTokenHandler, controller.system.deleteMenu);
  /** ** 角色管理 ****/
  // 获取角色列表
  router.get(`${config.contextPath}/system/role/list`, checkTokenHandler, controller.system.roleList);
  // 编辑角色
  router.post(`${config.contextPath}/system/role/edit`, checkTokenHandler, controller.system.editRole);
  // 编辑角色菜单
  router.post(`${config.contextPath}/system/role/menu/edit`, checkTokenHandler, controller.system.editRoleMenu);
  // 获取谷歌验证码绑定信息
  router.get(`${config.contextPath}/system/admin/open/google/auth`, checkTokenHandler, controller.system.openGoogleAuth);
  // 谷歌身份验证绑定
  router.get(`${config.contextPath}/system/admin/google/verify`, checkTokenHandler, controller.system.googleVerify);
};
