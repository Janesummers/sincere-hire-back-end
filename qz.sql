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

 Date: 07/02/2020 22:36:01
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
INSERT INTO `user` VALUES ('onmaV07KFbndEt5JwBXCuIlc-cvo', 'o3yoo42AkF6cJkr1V_gi1mSIXA-s', '陈立权', 'b25tYVYwN0tGYm5kRXQ1SndCWEN1SWxjLWN2bw==1581071362639.png', '1997.01', '男', '1752321720@qq.com', '漳州市', '学生', '善于沟通', '2020.05', NULL, NULL, NULL, NULL, NULL, 0);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user_education
-- ----------------------------
BEGIN;
INSERT INTO `user_education` VALUES (6, 'onmaV07KFbndEt5JwBXCuIlc-cvo', '闽江学院', '软件工程', '本科', '2018.09', '2020.07');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
