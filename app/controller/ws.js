'use strict';

const { Controller } = require('egg');

const { cpu, mem, sys, upTime } = require('../utils/os');

class WsController extends Controller {
  async hello() {
    const { ctx } = this;
    if (!ctx.websocket) {
      throw new Error('this function can only be use in websocket router');
    }

    // ctx.websocket
    //   .on('message', (msg) => {
    //     console.log('receive', msg);
    //   })
    //   .on('close', (code, reason) => {
    //     console.log('websocket closed', code, reason);
    //   });
    
    let useCpu = await cpu();
    let useMem = await mem();
    let _sys = await sys();
    ctx.websocket.send(JSON.stringify({ cpu: useCpu, mem: useMem, time: new Date().toISOString(), sys: _sys }));

    setInterval(async () => {
      useCpu = await cpu();
      useMem = await mem();
      _sys = await sys();
      ctx.websocket.send(JSON.stringify({ cpu: useCpu, mem: useMem, time: new Date().toISOString(), sys: _sys }));
    }, 1000);
  }
}

module.exports = WsController;