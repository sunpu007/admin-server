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

 Date: 15/12/2020 15:33:55
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
-- Table structure for sys_roles_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles_menus`;
CREATE TABLE `sys_roles_menus` (
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色菜单关联';

SET FOREIGN_KEY_CHECKS = 1;
