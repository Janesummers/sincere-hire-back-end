const qs = require('qs');
const path = require('path');
const fs = require('fs');
const msgResult = require('./msgResult');

var getCity = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }
  console.log('getCity');
  let data = fs.readFileSync(path.join(__dirname, '../static/city.js'), {encoding: 'utf8'});
  resp.json(msgResult.msg(JSON.parse(data)));
}

var getSchool = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }
  console.log('用户请求：getSchool')
  let data = fs.readFileSync(path.join(__dirname, '../static/school.js'), {encoding: 'utf8'});
  resp.json(msgResult.msg(JSON.parse(data)));
}

var getMajor = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }
  console.log('用户请求：getMajor')
  let data = fs.readFileSync(path.join(__dirname, '../static/major.js'), {encoding: 'utf8'});
  resp.json(msgResult.msg(JSON.parse(data)));
}

module.exports = {
  getCity,
  getSchool,
  getMajor
}