const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const util = require('../util/util');
const https = require('https');



var login = (req, resp) => {
  // console.log(req)
  let data = qs.parse(req.body);
  // console.log(data);
  let code = data.code;
  let unionid = data.unionid;
  let code2Session;
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx2bca6a5670f63aee&secret=cd00a7c8648a2f9de2bbf6fdd130aa35&js_code=${code}&grant_type=authorization_code`;
  
  getSessionKey();
  function getSessionKey () {
    https.get(url, data => {
      var str="";
      data.on("data",function(chunk){
          str+=chunk;//监听数据响应，拼接数据片段
      })
      data.on("end",function(){
        console.log(str.toString())
        code2Session = JSON.parse(str.toString());

        getUser();

        function getUser () {
          mysqlOpt.exec(
            "select * from user where openId = ?",
            mysqlOpt.formatParams(code2Session.openid),
            (res) => {
              console.log(res)
              // if (res.length > 0) {
              //   resp.json(msgResult.msg({
              //     unionid: code2Session.unionId
              //   }));
              // }
              resp.json(msgResult.msg('ok'));
              return;
            },
            e => {
              console.log(msgResult.error(e.message));
              resp.json(msgResult.error(e.message));
            }
          );
        }


        // if (unionid) {
        //   saveUser();
        // }
        // function saveUser () {
        //   mysqlOpt.exec(
        //     "insert into user (unionid, openId) values (?,?)",
        //     mysqlOpt.formatParams(unionid, code2Session.openid),
        //     () => {
        //       resp.json(msgResult.msg("登录并保存成功"));
        //     },
        //     e => {
        //       console.log(msgResult.error(e.message));
        //       if (msgResult.error(e.message).indexOf("for key 'PRIMARY'") != -1) {
        //         resp.json(msgResult.msg({
        //           unionid
        //         }));
        //       } else {
        //         resp.json(msgResult.error("用户数据保存错误"));
        //       }
        //     }
        //   );
        // }
        // if (code2Session.unionId) {
        //   resp.json(msgResult.msg({
        //     unionid: code2Session.unionId
        //   }));
        // } else {
        //   getId();
        // }
      })
    });
  }

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
    // console.log(data)
    const WXBizDataCrypt = require('../util/WXBizDataCrypt')
    var appId = 'wx2bca6a5670f63aee'
    var sessionKey = code2Session.session_key
    var encryptedData = decodeURIComponent(data.encryptedData);
    var iv = decodeURIComponent(data.iv);
    console.log(encryptedData);
    var pc = new WXBizDataCrypt(appId, sessionKey)

    var codes = pc.decryptData(encryptedData , iv)

     console.log('解密后 data: ', codes)
    
    if (codes.unionId) {
        mysqlOpt.exec(
              "insert into user (unionid) values (?)",
                    mysqlOpt.formatParams(codes.unionId),
                          () => {
                                  resp.json(msgResult.msg(codes));
                                        },
                                              e => {
                                                      console.log(msgResult.error(e.message));
                                                              resp.json(msgResult.error("用户数据保存错误"));
            }
        );
    } else {
        resp.json(msgResult.msg(codes));
    }

    //resp.json(msgResult.msg(codes));
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
