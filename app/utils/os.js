'use strict';

const os = require('os');

const { formatStr } = require('./');

function cpuAverage() {
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {
    //Select CPU core
    var cpu = cpus[i];
    //Total up the time in the cores tick
    for(const type in cpu.times) {
      totalTick += cpu.times[type];
   }     
    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }
  //Return the average Idle and Tick times
  return { idle: totalIdle / cpus.length,  total: totalTick / cpus.length };
}

exports.cpu = async () => {
  const startMeasure = cpuAverage();
  return new Promise((resolve) => {
    setTimeout(function() { 
      //Grab second Measure
      var endMeasure = cpuAverage(); 
      //Calculate the difference in idle and total time between the measures
      var idleDifference = endMeasure.idle - startMeasure.idle;
      var totalDifference = endMeasure.total - startMeasure.total;
      //Calculate the average percentage CPU usage
      var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      //Output result to console
      resolve({ used: percentageCPU, name: os.cpus()[0].model, coreNumber: os.cpus().length });
    }, 100);
  });
}

exports.mem = async () => {
  return new Promise((resolve) => {
    const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedmem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
    const usageRate = parseInt(usedmem / totalmem * 100);

    resolve({ totalmem, freemem, usedmem, usageRate });
  })
}

exports.upTime = async () => {
  const time = os.uptime();

  const day = Math.floor(time / 86400);
  const hour = Math.floor((time - day * 86400) / 3600);
  const minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
  const second = Math.floor(time - day * 86400 - hour * 3600 - minute * 60);
  // console.log('%d天%d时%d分%d秒', day, hour, minute, second);

  return Promise.resolve(formatStr('{0}天{1}时{2}分{3}秒', day, hour, minute, second));
}
