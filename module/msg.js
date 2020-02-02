const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const Base64 = require('js-base64').Base64;

var getMessageList = (req, resp) => {
  var params = qs.parse(req.body);
  if (!params.id) {
    resp.json(msgResult.error("参数不合法"));
    return;
  }
  let unionid = Base64.decode(params.id);
  mysqlOpt.exec(
    'select * from user where unionid <> ?',
    mysqlOpt.formatParams(unionid),
    res => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
    }
  )
};

var getMessage = (req, resp) => {
  var params = qs.parse(req.body);
  if (!params.id) {
    resp.json(msgResult.error("参数不合法"));
    return;
  }
  let unionid = Base64.decode(params.id);
  mysqlOpt.exec(
    'select * from user where unionid <> ?',
    mysqlOpt.formatParams(unionid),
    res => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
    }
  )
}

module.exports = {
  getMessageList,
  getMessage
};