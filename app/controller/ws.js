'use strict';

const { Controller } = require('egg');

const { cpu, mem } = require('../utils/os');

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
    // let useMem = await mem();
    ctx.websocket.send(JSON.stringify({ cpu: useCpu }));

    setInterval(async () => {
      useCpu = await cpu();
      // useMem = await mem();
      ctx.websocket.send(JSON.stringify({ cpu: useCpu }));
    }, 2000);
  }
}

module.exports = WsController;