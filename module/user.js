const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const util = require('../util/util');
const https = require('https');




var login = (req, resp) => {
  var query = qs.parse(req.body);
  var code = query.code;
  var user = query.user;
  let code2Session;
  https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx2bca6a5670f63aee&secret=cd00a7c8648a2f9de2bbf6fdd130aa35&js_code=${code}&grant_type=authorization_code`, data => {
    console.log(data)
    code2Session = data;
    getId();
  })


  // if (!user || !user.name || !user.pwd || !user.rule) {
  //   resp.json(msgResult.error("参数不合法"));
  //   return;
  // }
  // let sql = "select * from user where unionid = ? and password = ?";
  // if (user.rule != "user") {
  //   sql = "select * from user where unionid = ? and password = ? and rule = 1"
  // }
  // mysqlOpt.exec(
  //   sql,
  //   mysqlOpt.formatParams(user.name, user.pwd),
  //   res => {
  //     if (res.length > 0) {
  //       resp.json(msgResult.msg({nick: res[0].username, id: res[0].id}));
  //     } else {
  //       resp.json(msgResult.error("用户名或者密码错误"));
  //     }
  //   },
  //   e => {
  //     resp.end(msgResult.error(e.message));
  //   }
  // )
  function getId () {
    const WXBizDataCrypt = require('../util/WXBizDataCrypt')
    var appId = 'wx2bca6a5670f63aee'
    var sessionKey = code2Session.session_key
    var encryptedData = user.encryptedData
    var iv = user.encryptedData.iv

    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData , iv)

    console.log('解密后 data: ', data)

    resp.json(msgResult.msg(data));
  }
  


};

var register = (req, resp) => {
  var user = qs.parse(req.body);
  if (!user || !user.name || !user.pwd || !user.nick) {
    resp.json(msgResult.error("参数不合法"));
    return;
  }
  let id = util.randomNumber();
  mysqlOpt.exec(
    "insert into user values (?,?,?,?,?)",
    mysqlOpt.formatParams(id, user.name, user.nick, user.pwd, 0),
    () => {
      resp.json(msgResult.msg("注册成功"));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("nick/name已存在"));
    }
  )
};






module.exports = {
  login,
  register
};