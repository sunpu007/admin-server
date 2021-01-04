'use strict';

const os = require('os');

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
    const totalmem = os.totalmem() / 1024 / 1024;
    const freemem = os.freemem() / 1024 / 1024;

    resolve({ total: totalmem, used: totalmem - freemem, available: freemem, usageRate: ((totalmem - freemem) / totalmem).toFixed(2) })
  })
}
