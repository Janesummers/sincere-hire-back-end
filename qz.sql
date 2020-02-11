/*
 Navicat Premium Data Transfer

 Source Server         : clq
 Source Server Type    : MySQL
 Source Server Version : 50728
 Source Host           : localhost:3306
 Source Schema         : qz

 Target Server Type    : MySQL
 Target Server Version : 50728
 File Encoding         : 65001

 Date: 11/02/2020 14:49:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  `company` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `industry` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `companyScale` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `progress` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rule` int(2) DEFAULT NULL,
  PRIMARY KEY (`unionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('onmaV07KFbndEt5JwBXCuIlc-cvo', 'o3yoo42AkF6cJkr1V_gi1mSIXA-s', '陈立权', 'b25tYVYwN0tGYm5kRXQ1SndCWEN1SWxjLWN2bw==1581149202817.png', '1997.01', '男', '1752321720@qq.com', '漳州市', '学生', '自学能力强，对新的框架有足够的自学能力，自我问题解决能力，对项目有深度优化和追求完美的理念，吃苦耐劳，积极上进，能不断充实和完善自己。有良好的团队合作能力和团队沟通能力。', '2020.05', NULL, NULL, NULL, NULL, NULL, 0);
COMMIT;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user_education
-- ----------------------------
BEGIN;
INSERT INTO `user_education` VALUES (6, 'onmaV07KFbndEt5JwBXCuIlc-cvo', '闽江学院', '软件工程', '本科', '2018.09', '2020.07');
INSERT INTO `user_education` VALUES (7, 'onmaV07KFbndEt5JwBXCuIlc-cvo', '福州职业技术学院', '软件技术', '大专', '2015.09', '2018.07');
COMMIT;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of work_experience
-- ----------------------------
BEGIN;
INSERT INTO `work_experience` VALUES (1, 'onmaV07KFbndEt5JwBXCuIlc-cvo', '福建探极贸易有限公司', '前端工程师', '2018.03', '2018.06', '移动互联网', 3000, '书写微信小程序');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
