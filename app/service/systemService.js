'use strict';

const { Service } = require("egg");
const { RESULT_FAIL } = require("../constants/result");
const { generateAdminPwd, getMd5 } = require("../utils");
const GlobalError = require("../utils/GlobalError");

class SystemService extends Service {
  // 获取管理员账号
  async adminList() {
    return await this.app.mysql.query(`SELECT admin.admin_id adminId, admin.username username, admin.avatar_url avatarUrl, admin.status status, admin.role_id roleId,
      IFNULL(role.name, '') roleName, admin.create_by createBy, admin.create_time createTime, admin.update_by updateBy, admin.update_time updateTime FROM sys_admin admin
      LEFT JOIN sys_role role ON admin.role_id = role.role_id ORDER BY admin.create_time DESC;`);
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
      })
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
}

module.exports = SystemService;
