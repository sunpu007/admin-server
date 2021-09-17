'use strict';

const { app, assert } = require('egg-mock/bootstrap');
// const { getMd5 } = require('../../../app/utils');

describe('test/app/controller/home.test.js', () => {
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', async () => {
    // console.log(getMd5('123456'));
    const ctx = app.mockContext();
    // const result = await ctx.app.mysql.select('sys_admin');
    // const result = await ctx.app.mysql.update('sys_menu', { title: '角色管理1' }, { where: { menu_id: 5 } });
    // const result = await ctx.app.mysql.get('sys_menu', { menu_id: 5 });
    const result = await ctx.app.mysql.insert('schedule_job_log', { job_id: 6 });
    console.log(result);
    // return app.httpRequest()
    //   .get('/')
    //   .expect('hi, egg')
    //   .expect(200);
  });
});
