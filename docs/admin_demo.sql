/*
 Navicat Premium Data Transfer

 Source Server         : uat
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : adminDemodb:3306
 Source Schema         : admin_demo

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 27/09/2021 14:46:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for schedule_job
-- ----------------------------
DROP TABLE IF EXISTS `schedule_job`;
CREATE TABLE `schedule_job`  (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `cron` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'cron表达式',
  `jobName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务名',
  `jobHandler` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `params` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '参数',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '描述',
  `status` int(1) NOT NULL DEFAULT -1 COMMENT '状态 0启用 -1停止',
  `create_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人',
  `update_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`job_id`) USING BTREE,
  UNIQUE INDEX `key_id`(`job_id`) USING BTREE,
  INDEX `key_handler`(`jobHandler`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '定时任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of schedule_job
-- ----------------------------
INSERT INTO `schedule_job` VALUES (1, '*/5 * * * * *', 'test1', 'testHandler', '', '', -1, 'admin', 'admin', '2020-12-15 15:22:15', '2021-09-27 14:44:56');
INSERT INTO `schedule_job` VALUES (6, '0 0 * * * *', 'testCurl', 'testCurlHandler', '{\n\"url\": \"https://www.myjerry.cn\",\n\"method\": \"get\",\n\"data\": { \"id\": 1 }\n}', '调用接口', 0, 'admin', 'admin', '2021-09-03 10:32:32', '2021-09-27 14:44:57');

-- ----------------------------
-- Table structure for schedule_job_log
-- ----------------------------
DROP TABLE IF EXISTS `schedule_job_log`;
CREATE TABLE `schedule_job_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `job_handler` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `job_param` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务参数',
  `handle_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '任务执行时间',
  `job_log` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务日志',
  `job_status` int(1) NOT NULL DEFAULT 0 COMMENT '任务执行状态：0-成功 -1-失败',
  `error_log` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务异常日志',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `trigger_type` int(1) NOT NULL DEFAULT 0 COMMENT '触发类型：0-任务触发 1-手动触发',
  `execution_status` int(1) NOT NULL DEFAULT 0 COMMENT '任务状态：0-执行中 1-执行完成',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT =  CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '定时任务执行日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_admin
-- ----------------------------
DROP TABLE IF EXISTS `sys_admin`;
CREATE TABLE `sys_admin`  (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `role_id` int(2) NOT NULL DEFAULT 0 COMMENT '角色',
  `google_secret_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '谷歌私钥',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统管理员' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_admin
-- ----------------------------
INSERT INTO `sys_admin` VALUES (1, 'admin', 'https://oss-blog.myjerry.cn/avatar/blog-avatar.jpg', 'e10adc3949ba59abbe56e057f20f883e', 1, '', 0, 'system', 'system', '2020-12-10 22:28:54', '2021-09-27 14:34:28');
INSERT INTO `sys_admin` VALUES (2, 'test', 'https://oss-blog.myjerry.cn/avatar/blog-avatar.jpg', 'e10adc3949ba59abbe56e057f20f883e', 1, '', 0, 'admin', 'admin', '2020-12-15 17:18:00', '2021-08-31 15:42:42');

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) NOT NULL DEFAULT 0 COMMENT '上一级菜单ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单标题',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '组件名称',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '组件',
  `menu_sort` int(2) NOT NULL DEFAULT 0 COMMENT '排序',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '图标',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '路径',
  `redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '重定向',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `hidden` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否显示',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统菜单' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 'System', 'layout', 99, 'setting', 'system', '/system/admin', 0, 'admin', 'admin', '2020-12-12 20:42:46', '2020-12-30 15:00:57', 0);
INSERT INTO `sys_menu` VALUES (3, 1, '账号管理', 'SystemAdmin', 'system/admin', 1, 'user', 'admin', '', 0, 'admin', 'admin', '2020-12-12 20:57:48', '2021-07-28 20:55:19', 0);
INSERT INTO `sys_menu` VALUES (4, 1, '菜单管理', 'SystemMenu', 'system/menu', 2, 'menu', 'menu', '', 0, 'admin', 'admin', '2020-12-12 20:58:25', '2020-12-30 15:01:00', 0);
INSERT INTO `sys_menu` VALUES (5, 1, '角色管理', 'SystemRole', 'system/role', 3, 'user', 'role', '', 0, 'admin', 'admin', '2020-12-12 20:59:11', '2021-07-28 20:55:26', 0);
INSERT INTO `sys_menu` VALUES (6, 0, '任务管理', 'Task', 'layout', 1, 'task', 'task', '/task/schedule', 0, 'admin', 'admin', '2020-12-15 15:13:09', '2020-12-30 15:01:02', 0);
INSERT INTO `sys_menu` VALUES (7, 6, '定时任务管理', 'TaskSchedule', 'task/schedule', 2, 'schedule', 'schedule', '', 0, 'admin', 'admin', '2020-12-15 15:15:54', '2021-09-18 21:42:22', 0);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '角色名',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '描述',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', '拥有系统所有权限', 'admin', 'admin', '2020-12-12 20:55:17', '2021-09-03 16:56:58');
INSERT INTO `sys_role` VALUES (2, '运营', '运营角色', 'admin', 'admin', '2020-12-15 17:08:16', '2020-12-15 17:08:16');
INSERT INTO `sys_role` VALUES (3, '业务员', '业务员', 'admin', 'admin', '2021-09-16 22:06:59', '2021-09-18 09:06:37');

-- ----------------------------
-- Table structure for sys_roles_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles_menus`;
CREATE TABLE `sys_roles_menus`  (
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色菜单关联' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_roles_menus
-- ----------------------------
INSERT INTO `sys_roles_menus` VALUES (7, 1);
INSERT INTO `sys_roles_menus` VALUES (3, 1);
INSERT INTO `sys_roles_menus` VALUES (4, 1);
INSERT INTO `sys_roles_menus` VALUES (5, 1);
INSERT INTO `sys_roles_menus` VALUES (7, 2);
INSERT INTO `sys_roles_menus` VALUES (7, 3);
INSERT INTO `sys_roles_menus` VALUES (3, 3);
INSERT INTO `sys_roles_menus` VALUES (4, 3);
INSERT INTO `sys_roles_menus` VALUES (5, 3);

SET FOREIGN_KEY_CHECKS = 1;
