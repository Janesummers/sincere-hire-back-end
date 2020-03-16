const qs = require('qs');
const msgResult = require('./msgResult');
const mysqlOpt = require('../util/mysqlOpt');

let getHotTopic = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    num = 10,
    page = 1
  } = qs.parse(req.body);
  num = parseInt(num);
  page = parseInt(page);

  console.log('用户请求：getHotTapic');
  
  mysqlOpt.exec(
    `
     select * from hot_topic limit ?, ?
    `,
    mysqlOpt.formatParams((page - 1) * num, num),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取异常'));
    }
  );
}

let updateTopicRead = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    idx
  } = req.query;

  console.log('用户请求：updateTopicRead');
  
  mysqlOpt.exec(
    `
     update hot_topic set topic_read=topic_read+1 where topic_id = ? and id = ?
    `,
    mysqlOpt.formatParams(id, idx),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取异常'));
    }
  );
}

let commitAnswer = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    answerText,
    idx
  } = qs.parse(req.body);
  idx = parseInt(idx);

  console.log('用户请求：commitAnswer');

  let updateAnswerNum = new Promise((resolve, reject) => {
    mysqlOpt.exec(
      `
       update hot_topic set answer_num=answer_num+1 where topic_id = ? and id = ?
      `,
      mysqlOpt.formatParams(id, idx),
      (res) => {
        resolve();
      },
      e => {
        reject(e.message);
      }
    );
  })

  let insertAnswer = new Promise((resolve, reject) => {
    let date = new Date();
    let time = date.getTime().toString();
    mysqlOpt.exec(
      `
       insert topic_answer
       values (?,?,?,?,?,?)
      `,
      mysqlOpt.formatParams(null, id, idx, unionid, answerText, time),
      (res) => {
        resolve();
      },
      e => {
        reject(e.message);
      }
    );
  }) 

  let done = Promise.all([updateAnswerNum, insertAnswer]);

  done.then(res => {
    resp.json(msgResult.msg('ok'));
  }).catch(err => {
    console.log(err);
    resp.json(msgResult.error('获取异常'));
  })

}

let getAnswerList = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    idx,
    num = 10,
    page = 1
  } = qs.parse(req.body);
  idx = parseInt(idx);
  page = parseInt(page);
  num = parseInt(num);

  console.log('用户请求：getAnswerList');
  
  mysqlOpt.exec(
    `
     select topic.*, u.unionid, u.nickname, u.avatarUrl, u.identity, u.position
     from topic_answer as topic, user as u
     where topic.question_id = ? and topic.question_idx = ? and u.unionid = topic.unionid limit ?, ?
    `,
    mysqlOpt.formatParams(id, idx, (page - 1) * num, num),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取异常'));
    }
  );
}

module.exports = {
  getHotTopic,
  updateTopicRead,
  commitAnswer,
  getAnswerList
}