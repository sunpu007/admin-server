'use strict';

const { Service } = require('egg');
const { ADMIN_EXPIRE_TIME, ADMIN_PREFIX } = require('../constants/redis');
const { RESULT_FAIL } = require('../constants/result');
const { getMd5 } = require('../utils');
const GlobalError = require('../utils/GlobalError');

/**
 * 登陆相关
 */
class LoginService extends Service {
  // 登陆
  async login({ username, password }) {
    const adminInfo = await this.app.mysql.get('sys_admin', { username, password: getMd5(password) });
    if (adminInfo === null) throw new GlobalError(RESULT_FAIL, '用户名或密码错误');

    // 构建token生成数据
    const result = {
      adminId: adminInfo.admin_id,
      username: adminInfo.username,
      avatarUrl: adminInfo.avatar_url,
    };
    // 生成token
    const token = Buffer.from(JSON.stringify(result)).toString('base64');

    // 获取菜单
    result.asyncRoutes = await this.generateMenu(adminInfo.admin_id);

    // 保存缓存
    await this.ctx.app.redis.set(ADMIN_PREFIX + token, JSON.stringify(result), 'Ex', ADMIN_EXPIRE_TIME);

    // 更新登录时间
    await this.app.mysql.update('sys_admin', { update_time: new Date() }, { where: { admin_id: adminInfo.admin_id } });

    return token;
  }
  // 生成菜单
  async generateMenu(adminId) {
    let routers = await this.app.mysql.query('SELECT * FROM sys_menu WHERE menu_id IN (SELECT sys_roles_menus.menu_id FROM sys_admin, sys_roles_menus WHERE sys_admin.role_id = sys_roles_menus.role_id AND sys_admin.admin_id = ?) OR pid = 0', [ adminId ]);
    if (routers.length === 0) return [];

    routers = routers.map(router => {
      return {
        menu_id: router.menu_id,
        pid: router.pid,
        path: router.path,
        component: router.component,
        name: router.name,
        menu_sort: router.menu_sort,
        meta: {
          title: router.title,
          icon: router.icon,
        },
      };
    });
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
    return routersByOne.filter(item => item.children.length > 0);
  }
}

module.exports = LoginService;
