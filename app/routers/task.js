'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config, middleware } = app;
  const checkTokenHandler = middleware.checkTokenHandler();
  // 定时任务列表
  router.get(`${config.contextPath}/task/schedule/list`, checkTokenHandler, controller.task.scheduleList);
  // 修改/新增定时任务
  router.post(`${config.contextPath}/task/schedule/edit`, checkTokenHandler, controller.task.editSchedule);
  // 删除定时任务
  router.post(`${config.contextPath}/task/schedule/delete`, checkTokenHandler, controller.task.deleteSchedule);
  // 更新定时任务状态
  router.post(`${config.contextPath}/task/schedule/status/update`, checkTokenHandler, controller.task.updateStatusSchedule);
  // 执行任务
  router.post(`${config.contextPath}/task/schedule/run`, checkTokenHandler, controller.task.runSchedule);
};
