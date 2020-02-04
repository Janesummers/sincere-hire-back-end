const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const https = require('https');
const fs = require('fs');
const path = require('path');



var login = (req, resp) => {
  // console.log(req)
  let data = qs.parse(req.body);
  // console.log(data);
  let code = data.code;
  let code2Session;
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx2bca6a5670f63aee&secret=cd00a7c8648a2f9de2bbf6fdd130aa35&js_code=${code}&grant_type=authorization_code`;
  
  getSessionKey();
  function getSessionKey () {
    https.get(url, data => {
      var str="";
      data.on("data",function(chunk){
          str+=chunk; //监听数据响应，拼接数据片段
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
              if (res.length > 0) {
                resp.json(msgResult.msg(res));
              } else {
                getId();
              }
              return;
            },
            e => {
              console.log(msgResult.error(e.message));
              resp.json(msgResult.error(e.message));
            }
          );
        }
      })
    });
  }

  function getId () {
    const WXBizDataCrypt = require('../util/WXBizDataCrypt');
    var appId = 'wx2bca6a5670f63aee';
    var sessionKey = code2Session.session_key;
    var encryptedData = decodeURIComponent(data.encryptedData);
    var iv = decodeURIComponent(data.iv);
    console.log(encryptedData);
    var pc = new WXBizDataCrypt(appId, sessionKey);

    var codes = pc.decryptData(encryptedData , iv);

    console.log('解密后 data: ', codes);

    saveUserId(codes.unionId);

  }
  
  function saveUserId (unionid) {
    console.log("unionid->>>>", unionid)
    mysqlOpt.exec(
      "insert into user (unionid,openId) values (?,?)",
      mysqlOpt.formatParams(unionid, code2Session.openid),
      () => {
        resp.json(msgResult.msg(unionid));
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("用户数据保存错误"));
      }
    );
  }

};

var saveJobSeeker = (req, resp) => {
  let query = qs.parse(req.body);
  let {name, birthday, sex, email, city, identity, school, major, education, time_enrollment, time_graduation, advantage} = query;
  let unionid = req.query.unionid;

  mysqlOpt.exec(
    `update user
     set nickname = ?,birthday = ?,sex = ?,email = ?,city = ?,identity = ?,advantage = ?
     where unionid = ?`,
    mysqlOpt.formatParams(name, birthday, sex, email, city, identity, advantage, unionid),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );


}

var userAvatarUrl = (req, resp) => {
  let query = qs.parse(req.body);
  let filePath = './' + req.file.path; 
  let fileType = req.file.mimetype;
  let lastName = '';
  switch(fileType) {
    case 'image/png': 
      lastName = '.png';
      break;
    case 'image/jpeg': 
      lastName = '.jpg';
      break;
    default: 
      lastName = '.png';
      break;
  }
  let fileName = query.unionid + Date.now() + lastName;
  let unionid = Base64.decode(query.unionid);
  fs.rename(filePath, path.join(__dirname, '../static/upload/' + fileName), (err) => {
    if (err) {
      resp.json(msgResult.error("上传失败"));
    }else{
      mysqlOpt.exec(
        `update user
         set avatarUrl = ?
         where unionid = ?`,
        mysqlOpt.formatParams(fileName, unionid),
        (res) => {
          resp.json(msgResult.msg({
            text: "上传成功",
            img: fileName
          }));
        },
        e => {
          console.log(msgResult.error(e.message));
          resp.json(msgResult.error("上传失败"));
        }
      );
      
    }
  });
  
}

var userAvatar = (req, resp) => {
  var options = {
    root: path.join(__dirname, '../static/upload/'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  var fileName = req.params.name;
  resp.sendFile(fileName, options, (err) => {
    if (err) {
      console.log(err);
      resp.json(msgResult.error(err.status));
    } else {
      console.log('Sent:', fileName);
    }
  });
}







module.exports = {
  login,
  saveJobSeeker,
  userAvatarUrl,
  userAvatar
};
