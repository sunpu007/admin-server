'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { getMd5 } = require('../../../app/utils');

describe('test/app/controller/home.test.js', () => {
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', async () => {
    console.log(getMd5('123456'));
    // const ctx = app.mockContext();
    // const result = await ctx.app.mysql.select('sys_admin');
    // console.log(result);
    // return app.httpRequest()
    //   .get('/')
    //   .expect('hi, egg')
    //   .expect(200);
  });
});
