'use strict';

const os = require('os');
const process = require('child_process');
const { promisify } = require('util');

const { formatStr } = require('./');

const exec = promisify(process.exec);

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
      resolve({ used: percentageCPU, name: os.cpus()[0].model, threadNumber: os.cpus().length });
    }, 100);
  });
}

exports.mem = async () => {
  return new Promise(async (resolve) => {
    let totalmem = 0,
      freemem = 0,
      usedmem = 0,
      usageRate = 0;
    
    if (os.type() === 'Linux') {
      const { stdout } = await exec('free -m');
      let str = stdout.split('\n')[1].split(' ').filter(item => item != '');

      totalmem = str[1];
      freemem = str[1] - str[2];
      usedmem = str[2];
      usageRate = (usedmem / totalmem * 100).toFixed(2);
    } else {
      totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      usedmem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
      usageRate = parseInt(usedmem / totalmem * 100);
    }

    resolve({ totalmem, freemem, usedmem, usageRate });
  })
}

exports.sys = async () => {
  // 获取系统运行时间
  let date = '',sys = '',ip = '';

  const time = os.uptime();
  const day = Math.floor(time / 86400);
  const hour = Math.floor((time - day * 86400) / 3600);
  const minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
  const second = Math.floor(time - day * 86400 - hour * 3600 - minute * 60);

  date = formatStr('{0}天{1}时{2}分{3}秒', day, hour, minute, second);

  // 获取系统信息
  if (os.type() === 'Linux') {
    const { stdout } = await exec('cat /etc/redhat-release');
    sys = stdout.trim();
  } else if (os.type() === 'Darwin') {
    const { stdout } = await exec('sw_vers');
    stdout.split('\n').forEach(item => {
      sys += item.split(':')[1] ? item.split(':')[1] : '';
    })
    sys = sys.trim();
  } else if (os.type() === 'Windows_NT') {
    sys = '';
  }

  ip = '39.99.238.155';

  // 获取系统负载
  const loadavg = os.loadavg();
  const loadavg1m = loadavg[0].toFixed(2);
  const loadavg5m = loadavg[1].toFixed(2);
  const loadavg12m = loadavg[2].toFixed(2);


  return Promise.resolve({ date, sys, ip, loadavg1m, loadavg5m, loadavg12m });
}

exports.disk = async () => {
  let total = 0,
    available = 0,
    used = 0,
    usageRate = 0;
  
  let { stdout } = await exec('df -hl /');
  stdout = stdout.split('\n')[1].split(' ').filter(item => item != '');

  total = stdout[1];
  available = stdout[3];
  used = parseFloat(stdout[1]) * (parseFloat(stdout[4]) / 100);
  usageRate = parseFloat(stdout[4]);

  return Promise.resolve({ total, available, used, usageRate });
}