'use strict';

const { Service } = require('egg');
const { RESULT_FAIL } = require('../constants/result');
const { generateAdminPwd, getMd5 } = require('../utils');
const GlobalError = require('../utils/GlobalError');

const QRCode = require('qrcode');

class SystemService extends Service {
  // 获取管理员账号
  async adminList() {
    return await this.app.mysql.query(`SELECT admin.admin_id adminId, admin.username username, admin.avatar_url avatarUrl, admin.status status, admin.role_id roleId,
      IFNULL(role.name, '') roleName, admin.create_by createBy, admin.create_time createTime, admin.update_by updateBy, admin.update_time updateTime FROM sys_admin admin
      LEFT JOIN sys_role role ON admin.role_id = role.role_id ORDER BY admin.create_time ASC;`);
  }
  // 编辑/新增管理员账号
  async editAdmin(userName, { adminId, username, avatarUrl, roleId }) {
    if (!adminId) {
      // 新增
      const pwd = generateAdminPwd(8);
      await this.app.mysql.insert('sys_admin', {
        username,
        avatar_url: avatarUrl,
        role_id: roleId,
        password: getMd5(pwd),
        create_time: new Date(),
        create_by: userName,
        update_time: new Date(),
        update_by: userName,
      });
      return pwd;
    }
    // 修改
    await this.app.mysql.update('sys_admin', {
      update_time: new Date(),
      update_by: userName,
      username,
      avatar_url: avatarUrl,
      role_id: roleId,
    }, { where: { admin_id: adminId } });
  }
  // 删除管理员
  async deleteAdmin({ adminId }) {
    if (adminId === 1) throw new GlobalError(RESULT_FAIL, '超级管理员禁止删除！！！');
    await this.app.mysql.delete('sys_admin', { admin_id: adminId });
  }
  // 重置管理员密码
  async resetAdminPwd(username, { adminId }) {
    const pwd = generateAdminPwd(8);
    await this.app.mysql.update('sys_admin', { password: getMd5(pwd), update_by: username, update_time: new Date() }, { where: { admin_id: adminId } });
    return pwd;
  }
  // 修改管理员密码
  async editAdminPwd({ adminId, oldPwd, newPwd }) {
    const result = await this.app.mysql.get('sys_admin', { admin_id: adminId, password: getMd5(oldPwd) });
    if (result === null) throw new GlobalError(RESULT_FAIL, '旧密码错误');
    await this.app.mysql.update('sys_admin', { password: getMd5(newPwd) }, { where: { admin_id: adminId } });
  }
  // 获取菜单列表
  async menuList() {
    const routers = await this.app.mysql.select('sys_menu', { where: { status: 0 } });
    let routersByOne = routers.filter(router => router.pid === 0).sort((a, b) => a.menu_sort - b.menu_sort);
    const routersByTwo = routers.filter(router => router.pid !== 0);
    const tempObj = {};
    routersByTwo.forEach(router => {
      if (!tempObj[router.pid] || tempObj[router.pid].length <= 0) {
        tempObj[router.pid] = [ router ];
      } else {
        tempObj[router.pid].push(router);
      }
    });
    routersByOne = routersByOne.map(router => {
      router.children = tempObj[router.menu_id] ? tempObj[router.menu_id].sort((a, b) => a.menu_sort - b.menu_sort) : [];
      return router;
    });
    return routersByOne;
  }
  // 编辑菜单
  async editMenu(username, { menu_id, title, name, component, icon, path, redirect, pid, menu_sort, hidden }) {
    if (menu_id) {
      // 修改
      await this.app.mysql.update('sys_menu', { title, name, component, icon, path, redirect, pid, menu_sort, hidden, update_by: username, update_time: new Date() },
        { where: { menu_id } });
    } else {
      // 创建
      await this.app.mysql.insert('sys_menu', { title, name, component, icon, path, redirect: redirect || '', pid, menu_sort, hidden, update_by: username,
        update_time: new Date(), create_by: username, create_time: new Date() });
    }
  }
  // 删除菜单
  async deleteMenu(username, { menu_id }) {
    this.app.mysql.update('sys_menu', { status: -1, update_by: username, update_time: new Date() }, { where: { menu_id } });
  }
  // 获取角色列表
  async roleList() {
    const list = await this.app.mysql.query('SELECT sys_role.*, IFNULL(GROUP_CONCAT(sys_roles_menus.menu_id), \'\') menus FROM sys_role LEFT JOIN sys_roles_menus ON (sys_roles_menus.role_id = sys_role.role_id) GROUP BY sys_role.role_id');
    return list.map(item => {
      item.menus = item.menus.split(',').map(Number);
      return item;
    });
  }
  // 编辑角色
  async editRole(username, { role_id, name, description }) {
    if (role_id) {
      // 修改
      await this.app.mysql.update('sys_role', { name, description, update_by: username, update_time: new Date() }, { where: { role_id } });
    } else {
      await this.app.mysql.insert('sys_role', { name, description, update_by: username, update_time: new Date(), create_by: username, create_time: new Date() });
    }
  }
  // 编辑角色菜单
  async editRoleMenu({ role_id, menuIds }) {
    if (role_id === 1) throw new GlobalError(RESULT_FAIL, '超级管理员权限不允许更改')
    // 删除当前所有绑定关系
    await this.app.mysql.delete('sys_roles_menus', { role_id });
    // 保存更新后的绑定关系
    const insertArr = menuIds.map(id => {
      return { menu_id: id, role_id };
    });
    await this.app.mysql.insert('sys_roles_menus', insertArr);
  }
  // 获取谷歌验证码绑定信息
  async openGoogleAuth() {
    const { adminId } = ctx.request.headers;
    // 获取用户信息
    const adminInfo = await this.app.mysql.get('sys_admin', { admin_id: adminId });
    if (adminInfo && adminInfo.google_secret_key !== '') throw new GlobalError(RESULT_FAIL, '您已开启谷歌身份验证！');
    // 生成私钥
    const secretKey = await this.ctx.helper.generateGoogleSecretKey();
    // 生成二维码信息
    const imgStr = await this.ctx.helper.generateGoogleQrCodeData(secretKey, adminInfo.username);
    return {
      googleImg: await QRCode.toDataURL(imgStr),
      googleKey: secretKey,
      googleUser: adminInfo.username,
    };
  }
  // 谷歌身份验证绑定
  async googleVerify({ googleKey, googleCode, loginPwd }) {
    const { adminId } = ctx.request.headers;
    // 验证谷歌验证码
    const verify = await this.ctx.helper.googleAuthVerify(googleKey, googleCode);
    if (!verify) throw new GlobalError(RESULT_FAIL, '谷歌验证码不正确');
    // 更新用户信息
    const result = await this.app.mysql.update('sys_admin', { google_secret_key: googleKey }, { where: { admin_id: adminId, password: getMd5(loginPwd) } });
    if (result.affectedRows === 1) throw new GlobalError(RESULT_FAIL, '密码错误，请重新输入');
  }
}

module.exports = SystemService;
