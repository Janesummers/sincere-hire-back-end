const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const Base64 = require('js-base64').Base64;
const path = require('path');
const fs = require('fs');

var getMessageList = (req, resp) => {
  var params = qs.parse(req.body);
  if (!params.id) {
    resp.json(msgResult.error("参数不合法"));
    return;
  }
  let unionid = Base64.decode(params.id);

  let sql = '';

  // if (params.rule != 'job_seeker') {
  //   sql = `select u.*, comp.company_name  
  //   from user as u, company as comp
  //   where (u.company_id = comp.company_id) and u.unionid <> ?`
  // } else {
  //   sql = `select *
  //   from user
  //   where unionid <> ?`
  // }

  mysqlOpt.exec(
    `select msg.*,(SELECT avatarUrl from user where unionid = msg.target_id) as avatarUrl
    from message as msg, user as u
    where msg.ascription_id = ? and msg.target_id = u.unionid`,
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
  if (!params.id || params.id.length != 28) {
    resp.json(msgResult.error("参数不合法"));
    return;
  }
  let id = Base64.encode(params.id);

  console.log('用户请求：getMessage');

  let filePath = path.join(__dirname, '../static/chats')

  const dir = fs.readdirSync(filePath, {
    encoding: 'utf8'
  })

  let msgs = {};

  let len = 0;

  let reg = RegExp(`(_?)${id}(_?)`)

  dir.forEach(item => {
    if (item.includes(id)) {
      len += 1;
      let key = item.replace(reg, '').match(/.+(?=.json)/)[0];
      let data = fs.readFileSync(`${filePath}/${item}`, {encoding: 'utf8'});
      msgs[key] = JSON.parse(`[${data}]`);
    }
  })

  if (len > 0) {
    resp.json(msgResult.msg([msgs]));
  } else {
    resp.json(msgResult.msg([]));
  }

  
}

var saveMessageList = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：saveMessageList');

  let {
    id,
    name,
    company,
    commit_name
  } = qs.parse(req.body);
  check();
  function check () {
    mysqlOpt.exec(
      `select * from message where ascription_id = ? and target_id = ?`,
      mysqlOpt.formatParams(unionid, id),
      (res) => {
        if (res.length < 1) {
          insert();
        } else {
          resp.json(msgResult.msg('ok'));
        }
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error('新增聊天对象失败'));
      }
    );
  }

  function insert () {
    mysqlOpt.exec(
      `insert into message (ascription_id, target_id, target_name, target_company)
       values (?,?,?,?)`,
      mysqlOpt.formatParams(unionid, id, name, company),
      (res) => {
        insertTarget();
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error('新增聊天对象失败'));
      }
    );
  }

  function insertTarget() {
    mysqlOpt.exec(
      `insert into message (ascription_id, target_id, target_name)
       values (?,?,?)`,
      mysqlOpt.formatParams(id, unionid, commit_name),
      (res) => {
        resp.json(msgResult.msg('ok'));
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error('新增聊天对象失败'));
      }
    );
  }

}

module.exports = {
  getMessageList,
  getMessage,
  saveMessageList
};