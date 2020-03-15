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
    num,
    idx
  } = req.query;

  console.log('用户请求：updateTopicRead');
  
  mysqlOpt.exec(
    `
     update hot_topic set topic_read = ? where topic_id = ? and id = ?
    `,
    mysqlOpt.formatParams(num, id, idx),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取异常'));
    }
  );
}

module.exports = {
  getHotTopic,
  updateTopicRead
}