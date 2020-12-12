'use strict';

const crypto = require('crypto');

const { RESULT_SUCC } = require('./../constants/result');

/**
 * 接口统一返回格式
 * @param {*} data
 * code:Number 状态码
 * message:String 提示，code非RESULT_SUCC时必传
 * data:Object 返回数据
 */
exports.setResult = data => {
  return {
    code: (data && data.code) || RESULT_SUCC,
    message: (data && data.messages) || 'success',
    data: data && data.data,
  };
};

/**
 * 生成管理员密码
 * @param {*} length 密码长度
 */
exports.generateAdminPwd = length => {
  const pasArr = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!' ];
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += pasArr[Math.floor(Math.random() * pasArr.length)];
  }
  return pwd;
};

/**
 * 获取md5
 * @param {*} str 字符串
 */
exports.getMd5 = str => {
  return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * 生成管理员密码
 * @param {*} length 密码长度
 */
exports.generateAdminPwd = length => {
  const pasArr = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!' ];
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += pasArr[Math.floor(Math.random() * pasArr.length)];
  }
  return pwd;
};
