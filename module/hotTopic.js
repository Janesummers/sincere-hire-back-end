const qs = require('qs');
const msgResult = require('./msgResult');
const mysqlOpt = require('../util/mysqlOpt');
const util = require('../util/util');

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

  console.log('time: ' + util.getTime() +  ' 用户请求：getHotTapic');
  
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
      resp.json(msgResult.error('获取话题异常'));
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

  console.log('time: ' + util.getTime() +  ' 用户请求：updateTopicRead');
  
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
      resp.json(msgResult.error('更新话题阅读数异常'));
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

  console.log('time: ' + util.getTime() +  ' 用户请求：commitAnswer');

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
    resp.json(msgResult.error('添加回答异常'));
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

  console.log('time: ' + util.getTime() +  ' 用户请求：getAnswerList');
  
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
      resp.json(msgResult.error('获取回答列表异常'));
    }
  );
}

let attentionTopic = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    idx
  } = req.query;
  idx = parseInt(idx);

  console.log('time: ' + util.getTime() +  ' 用户请求：attentionTopic');
  
  mysqlOpt.exec(
    `
     insert into topic_attention
     values (?,?,?,?)
    `,
    mysqlOpt.formatParams(null, id, idx, unionid),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('关注异常'));
    }
  );
}

let cancelAttention = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    idx
  } = req.query;
  idx = parseInt(idx);

  console.log('time: ' + util.getTime() +  ' 用户请求：cancelAttention');
  
  mysqlOpt.exec(
    `
     delete from topic_attention
     where unionid = ? and question_id = ? and question_idx = ?
    `,
    mysqlOpt.formatParams(unionid, id, idx),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('取消关注异常'));
    }
  );
}

let getOnceAttention = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    id,
    idx
  } = req.query;
  idx = parseInt(idx);

  console.log('time: ' + util.getTime() +  ' 用户请求：cancelAttention');
  
  mysqlOpt.exec(
    `
     select * from topic_attention
     where unionid = ? and question_id = ? and question_idx = ?
    `,
    mysqlOpt.formatParams(unionid, id, idx),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取关注信息异常'));
    }
  );
}

let getAttentionList = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    page = 1,
    num = 10
  } = qs.parse(req.body);

  page = parseInt(page);
  num = parseInt(num);

  console.log('time: ' + util.getTime() +  ' 用户请求：getAttentionList');
  
  mysqlOpt.exec(
    `
     select topic.*
     from topic_attention as topicAt, hot_topic as topic
     where topicAt.unionid = ? and topicAt.question_id = topic.topic_id and topicAt.question_idx = topic.id limit ?, ?
    `,
    mysqlOpt.formatParams(unionid, (page - 1) * num, num),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取关注列表异常'));
    }
  );
}

module.exports = {
  getHotTopic,
  updateTopicRead,
  commitAnswer,
  getAnswerList,
  attentionTopic,
  cancelAttention,
  getOnceAttention,
  getAttentionList
}