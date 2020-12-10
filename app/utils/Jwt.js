'use strict';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


/**
 * token生成类
 */
class Jwt {
  constructor(data) {
    this.data = data;
  }
  /**
   * 生成token
   */
  async generateToken() {
    return new Promise(resolve => {
      fs.readFile(path.join(__dirname, '../static/private_key.pem'), 'utf-8', (err, cert) => {
        if (err) return console.log('文件读取错误', err);
        const token = jwt.sign({
          ...this.data,
        }, cert, {
          algorithm: 'RS256',
          expiresIn: '30d',
        });
        resolve(token);
      });
    });
  }
  /**
   * 校验token
   */
  verifyToken() {
    return new Promise(resolve => {
      fs.readFile(path.join(__dirname, '../static/public_key.pem'), 'utf-8', (err, cert) => {
        if (err) return console.log('文件读取错误', err);
        let res;
        try {
          const result = jwt.verify(this.data, cert, { algorithms: 'RS256' }) || {};
          const { exp = 0 } = result,
            current = Math.floor(Date.now() / 1000);
          if (current <= exp) {
            res = result || {};
          } else {
            res = 'err';
          }
        } catch (e) {
          res = 'err';
        }
        resolve(res);
      });
    });
  }
}

module.exports = Jwt;
