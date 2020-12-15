/*
 Navicat Premium Data Transfer

 Source Server         : adminDemodb
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : adminDemodb:3306
 Source Schema         : admin_demo

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 15/12/2020 17:02:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for schedule_job
-- ----------------------------
DROP TABLE IF EXISTS `schedule_job`;
CREATE TABLE `schedule_job` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `cron` varchar(50) NOT NULL DEFAULT '' COMMENT 'cron表达式',
  `jobName` varchar(100) NOT NULL DEFAULT '' COMMENT '任务名',
  `jobHandler` varchar(100) NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `params` varchar(255) NOT NULL COMMENT '参数',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `status` int(1) NOT NULL DEFAULT '-1' COMMENT '状态 0启用 -1停止',
  `create_by` varchar(100) NOT NULL COMMENT '创建人',
  `update_by` varchar(100) NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`job_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='定时任务表';

-- ----------------------------
-- Records of schedule_job
-- ----------------------------
BEGIN;
INSERT INTO `schedule_job` VALUES (1, '*/5 * * * * *', 'test', 'testHandler', '', '', -1, 'admin', 'admin', '2020-12-15 15:22:15', '2020-12-15 15:22:15');
COMMIT;

-- ----------------------------
-- Table structure for sys_admin
-- ----------------------------
DROP TABLE IF EXISTS `sys_admin`;
CREATE TABLE `sys_admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(255) NOT NULL DEFAULT '' COMMENT '用户名',
  `avatar_url` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `role_id` int(2) NOT NULL DEFAULT '0' COMMENT '角色',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统管理员';

-- ----------------------------
-- Records of sys_admin
-- ----------------------------
BEGIN;
INSERT INTO `sys_admin` VALUES (1, 'admin', 'https://cdn-blog.myjerry.cn/avatar/blog-avatar.jpg', 'e10adc3949ba59abbe56e057f20f883e', 1, 0, '', '', '2020-12-10 22:28:54', '2020-12-15 15:16:09');
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '上一级菜单ID',
  `title` varchar(255) NOT NULL COMMENT '菜单标题',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '组件名称',
  `component` varchar(255) NOT NULL DEFAULT '' COMMENT '组件',
  `menu_sort` int(2) NOT NULL DEFAULT '0' COMMENT '排序',
  `icon` varchar(255) NOT NULL DEFAULT '' COMMENT '图标',
  `path` varchar(255) NOT NULL DEFAULT '' COMMENT '路径',
  `redirect` varchar(255) NOT NULL DEFAULT '' COMMENT '重定向',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统菜单';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 'System', 'layout', 99, 'setting', 'system', '/system/admin', 0, 'admin', 'admin', '2020-12-12 20:42:46', '2020-12-12 20:42:46');
INSERT INTO `sys_menu` VALUES (3, 1, '账号管理', 'SystemAdmin', 'system/admin', 1, 'user', 'admin', '', 0, 'admin', 'admin', '2020-12-12 20:57:48', '2020-12-12 20:57:48');
INSERT INTO `sys_menu` VALUES (4, 1, '菜单管理', 'SystemMenu', 'system/menu', 2, 'menu', 'menu', '', 0, 'admin', 'admin', '2020-12-12 20:58:25', '2020-12-12 20:58:25');
INSERT INTO `sys_menu` VALUES (5, 1, '角色管理', 'SystemRole', 'system/role', 3, 'user', 'role', '', 0, 'admin', 'admin', '2020-12-12 20:59:11', '2020-12-15 14:02:29');
INSERT INTO `sys_menu` VALUES (6, 0, '任务管理', 'Task', 'layout', 1, 'task', 'task', '/task/schedule', 0, 'admin', 'admin', '2020-12-15 15:13:09', '2020-12-15 15:13:09');
INSERT INTO `sys_menu` VALUES (7, 6, '定时任务管理', 'TaskSchedule', 'task/schedule', 1, 'schedule', 'schedule', '', 0, 'admin', 'admin', '2020-12-15 15:15:54', '2020-12-15 15:15:54');
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '角色名',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (1, '超级管理员', '拥有系统所有权限', 'admin', 'admin', '2020-12-12 20:55:17', '2020-12-12 20:55:17');
COMMIT;

-- ----------------------------
-- Table structure for sys_roles_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles_menus`;
CREATE TABLE `sys_roles_menus` (
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色菜单关联';

-- ----------------------------
-- Records of sys_roles_menus
-- ----------------------------
BEGIN;
INSERT INTO `sys_roles_menus` VALUES (7, 1);
INSERT INTO `sys_roles_menus` VALUES (3, 1);
INSERT INTO `sys_roles_menus` VALUES (4, 1);
INSERT INTO `sys_roles_menus` VALUES (5, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
