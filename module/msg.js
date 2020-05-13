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

  mysqlOpt.exec(
    `select msg.*, u.avatarUrl
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

  try {
    const dir = fs.readdirSync(filePath, {
      encoding: 'utf8'
    })
    let msgs = {};

    let len = 0;

    let reg = RegExp(`(_?)${id}(_?)`)

    dir.forEach(item => {
      if (item.includes(id)) {
        console.log(item)
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
  } catch (e) {
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
    commit_name,
    job_id
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
      `insert into message (ascription_id, target_id, target_name, target_company, job_id)
       values (?,?,?,?,?)`,
      mysqlOpt.formatParams(id, unionid, commit_name, company, job_id),
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

let getInviteList = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getInviteList');

  mysqlOpt.exec(
    `select invite.*, u.nickname as recruiter_name, u.position, u.avatarUrl
     from invite_interview as invite, user as u 
     where invite.unionid = ? and u.unionid = invite.invite_user_id`,
    mysqlOpt.formatParams(unionid),
    (res) => {
      resp.json(msgResult.msg(res));
      return;
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取面试邀请列表失败'));
    }
  );
}

let getOnceInvite = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getOnceInvite');

  let id = qs.parse(req.body).id;

  mysqlOpt.exec(
    `select invite.*, u.nickname as recruiter_name, u.position, u.avatarUrl
     from invite_interview as invite, user as u 
     where invite.invite_id = ? and u.unionid = invite.invite_user_id`,
    mysqlOpt.formatParams(id),
    (res) => {
      resp.json(msgResult.msg(res));
      return;
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取面试邀请失败'));
    }
  );
}

let updateInvite = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getOnceInvite');

  let {
    id,
    status
  } = req.query;

  mysqlOpt.exec(
    `update invite_interview
     set status = ? where invite_id = ?`,
    mysqlOpt.formatParams(status, id),
    (res) => {
      resp.json(msgResult.msg('ok'));
      return;
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('更新面试邀请状态失败'));
    }
  );
}

module.exports = {
  getMessageList,
  getMessage,
  saveMessageList,
  getInviteList,
  updateInvite,
  getOnceInvite
};