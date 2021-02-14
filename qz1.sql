/*
 Navicat Premium Data Transfer

 Source Server         : cms
 Source Server Type    : MySQL
 Source Server Version : 50728
 Source Host           : 134.175.68.141:3306
 Source Schema         : qz

 Target Server Type    : MySQL
 Target Server Version : 50728
 File Encoding         : 65001

 Date: 04/11/2020 14:44:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for collect
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unionid` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `job_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `company_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `size` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for hot_topic
-- ----------------------------
DROP TABLE IF EXISTS `hot_topic`;
CREATE TABLE `hot_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic_id` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `toppic_content` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `answer_num` int(20) DEFAULT '0',
  `topic_read` int(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for invite_interview
-- ----------------------------
DROP TABLE IF EXISTS `invite_interview`;
CREATE TABLE `invite_interview` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `invite_id` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unionid` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_user_id` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_time` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_company` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_job` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_addr` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invite_remark` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(3) DEFAULT NULL,
  `update_time` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `job_id` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `company_id` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `job_name` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `job_type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `empl_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `working_exp` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `welfare` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `welfare_all` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `salary` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `skill_require` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `other_require` varchar(1400) COLLATE utf8_unicode_ci DEFAULT NULL,
  `job_address` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `recruit` varchar(8) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publisher_id` varchar(30) COLLATE utf8_unicode_ci DEFAULT 'onmaV07KFbndEt5JwBXCuIlc-cvo',
  `edu_level` varchar(8) COLLATE utf8_unicode_ci DEFAULT NULL,
  `update_date` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ascription_id` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `target_id` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `target_name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `target_company` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `job_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for topic_answer
-- ----------------------------
DROP TABLE IF EXISTS `topic_answer`;
CREATE TABLE `topic_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `question_idx` int(10) DEFAULT NULL,
  `unionid` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(400) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for topic_attention
-- ----------------------------
DROP TABLE IF EXISTS `topic_attention`;
CREATE TABLE `topic_attention` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `question_idx` int(10) DEFAULT NULL,
  `unionid` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `unionid` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `openId` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nickname` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthday` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sex` varchar(4) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `identity` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `advantage` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `jobTime` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `position` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_id` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rule` int(2) DEFAULT NULL,
  PRIMARY KEY (`unionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for user_education
-- ----------------------------
DROP TABLE IF EXISTS `user_education`;
CREATE TABLE `user_education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unionid` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `school` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `major` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `education` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `time_enrollment` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `time_graduation` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for work_experience
-- ----------------------------
DROP TABLE IF EXISTS `work_experience`;
CREATE TABLE `work_experience` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unionid` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `company_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `position` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `hiredate` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `leavedate` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `industry` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `salary` int(10) NOT NULL,
  `job_description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
