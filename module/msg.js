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

  let sql = '';

  if (params.rule != 'job_seeker') {
    sql = `select u.*, comp.company_name  
    from user as u, company as comp
    where (u.company_id = comp.company_id) and u.unionid <> ?`
  } else {
    sql = `select *
    from user
    where unionid <> ?`
  }

  mysqlOpt.exec(
    `select *
    from user
    where unionid <> ?`,
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