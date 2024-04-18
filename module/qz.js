const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const websocket = require('../chat/wss.js');
const multer  = require('multer')
const upload = multer({ dest: './tmp/' })
const msgResult = require('./msgResult');
const util = require('../util/util');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.disable('x-powered-by');

// websocket.runServer();


/**
 * 全系统允许跨域处理 这段配置要再new出express实例的时候就要设置了
 */
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","*");
  if (req.method.toLowerCase() === 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
});

// 用户路由
const user = require('./user');
/**
 * 登录
 */
app.post("/login", (req, resp) => {
  user.login(req, resp);
});
/**
 * 保存求职者信息
 */
app.post("/saveJobSeeker", (req, resp) => {
  user.saveJobSeeker(req, resp);
});
/**
 * 保存招聘者信息
 */
app.post("/saveRecruiter", (req, resp) => {
  user.saveRecruiter(req, resp);
});
/**
 * 上传用户头像
 */
app.post("/userAvatarUrl", upload.single('file'), (req, resp) => {
  user.userAvatarUrl(req, resp);
});
/**
 * 获取头像
 */
app.get("/userAvatar/:name", (req, resp) => {
  user.userAvatar(req, resp);
});
/**
 * 保存用户基础信息
 */
app.post("/saveUserInfo", (req, resp) => {
  user.saveUserInfo(req, resp);
})
/**
 * 获取教育经历
 */
app.get('/getUserEducation', (req, resp) => {
  user.getUserEducation(req, resp);
})
/**
 * 新增教育经历
 */
app.post('/addEducation', (req, resp) => {
  user.addEducation(req, resp);
})
/**
 * 更改教育经历
 */
app.post('/changeEducation', (req, resp) => {
  user.changeEducation(req, resp);
})
/**
 * 删除教育经历
 */
app.post('/delEducation', (req, resp) => {
  user.delEducation(req, resp);
})
/**
 * 获取用户基础信息
 */
app.get('/getUserInfo', (req, resp) => {
  user.getUserInfo(req, resp);
})
/**
 * 添加工作经历
 */
app.post('/addWorkExperience', (req, resp) => {
  user.addWorkExperience(req, resp);
})
/**
 * 更改工作经历
 */
app.post('/changeWorkExperience', (req, resp) => {
  user.changeWorkExperience(req, resp);
})
/**
 * 删除工作经历
 */
app.post('/delWorkExperience', (req, resp) => {
  user.delWorkExperience(req, resp);
})
/**
 * 获取用户工作经历
 */
app.get('/getUserWork', (req, resp) => {
  user.getUserWork(req, resp);
});
/**
 * 保存自我介绍信息
 */
app.post('/saveEvaluate', (req, resp) => {
  user.saveEvaluate(req, resp);
});
/**
 * 获取用户在线简历信息
 */
app.get('/getUserResume', (req, resp) => {
  user.getUserResume(req, resp);
})
/**
 * 获取头像
 */
app.get('/getAvar', (req, resp) => {
  user.getAvar(req, resp);
})
const openData = require('./openData');
/**
 * 获取城市信息
 */
app.get("/getCity", (req, resp) => {
  openData.getCity(req, resp);
});
/**
 * 获取学校信息
 */
app.get("/getSchool", (req, resp) => {
  openData.getSchool(req, resp);
});
/**
 * 获取专业信息
 */
app.get("/getMajor", (req, resp) => {
  openData.getMajor(req, resp);
});

const msg = require('./msg');
/**
 * 获取消息列表
 */
app.post("/getMessageList", (req, resp) => {
  msg.getMessageList(req, resp);
});
/**
 * 获取消息记录
 */
app.post("/getMessage", (req, resp) => {
  msg.getMessage(req, resp);
})
/**
 * 保存消息列表
 */
app.post("/saveMessageList", (req, resp) => {
  msg.saveMessageList(req, resp);
})
/**
 * 获取面试邀请列表
 */
app.get('/getInviteList', (req, resp) => {
  msg.getInviteList(req, resp);
})
/**
 * 更新面试邀请状态
 */
app.get('/updateInvite', (req, resp) => {
  msg.updateInvite(req, resp);
})
/**
 * 获取单个面试邀请信息
 */
app.post('/getOnceInvite', (req, resp) => {
  msg.getOnceInvite(req, resp);
})

const jobs = require('./jobs');
/**
 * 获取
 */
app.post('/getPracticeJobs', (req, resp) => {
  jobs.getPracticeJobs(req, resp);
})

app.post('/searchJob', (req, resp) => {
  jobs.searchJob(req, resp);
})

app.get('/getCollect', (req, resp) => {
  jobs.getCollect(req, resp);
})

app.get('/setCollect', (req, resp) => {
  jobs.setCollect(req, resp);
})

app.get('/getUserCollect', (req, resp) => {
  jobs.getUserCollect(req, resp);
})

app.post('/saveJob', (req, resp) => {
  jobs.saveJob(req, resp);
})

app.get('/getMyRelease', (req, resp) => {
  jobs.getMyRelease(req, resp);
})

app.post('/getJobDetail', (req, resp) => {
  jobs.getJobDetail(req, resp);
})

const reptile = require('./reptile');
app.post('/saveJobInfo', (req, resp) => {
  reptile.saveJobInfo(req, resp);
})

app.post('/saveTopic', (req, resp) => {
  reptile.saveTopic(req, resp);
})

const hotTopic = require('./hotTopic');
app.post('/getHotTopic', (req, resp) => {
  hotTopic.getHotTopic(req, resp);
})

app.get('/updateTopicRead', (req, resp) => {
  hotTopic.updateTopicRead(req, resp);
})

app.post('/commitAnswer', (req, resp) => {
  hotTopic.commitAnswer(req, resp);
})

app.post('/getAnswerList', (req, resp) => {
  hotTopic.getAnswerList(req, resp);
})

app.get('/attentionTopic', (req, resp) => {
  hotTopic.attentionTopic(req, resp);
})

app.get('/cancelAttention', (req, resp) => {
  hotTopic.cancelAttention(req, resp);
})

app.get('/getOnceAttention', (req, resp) => {
  hotTopic.getOnceAttention(req, resp);
})

app.post('/getAttentionList', (req, resp) => {
  hotTopic.getAttentionList(req, resp);
})

const epidemic = require('./epidemic');
app.get('/getEpidemic', (req, resp) => {
  epidemic.getEpidemic(req, resp);
})

app.post('/log', (req, resp) => {
  console.log(`${util.getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  resp.json(msgResult.msg({status: '成功'}));
})


app.get('/test', (req, resp) => {
  let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2bca6a5670f63aee&secret=0626d7fe02603759302a5079564d8389'
  let getToken = new Promise((resolve, reject) => {
    https.get(url, data => {
      var str="";
      data.on("data", (chunk) => {
          str+=chunk; //监听数据响应，拼接数据片段
      })
      data.on("end",() => {
        console.log(str.toString())
        let access_token = JSON.parse(str.toString());
        console.log('access_token', access_token);
        resolve(access_token.access_token)
        // console.log(code2Session.openid)
      })
    })
  })
  getToken.then(res => {
    return new Promise((resolve, reject) => {
      let query = `db.collection('goods').where({_id: '1329'}).get()`
      let body = JSON.stringify({
        env: 'red-packet-c1875',
        query
      });
      let url = `https://api.weixin.qq.com/tcb/databasequery?access_token=${res}`
      let options = {
        'method': 'POST',
        url,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      };
      request(options, (error, response) => {
        if (error) reject(new Error(error));
        resolve(response.body)
        console.log(response.body);
      });
    })
  }).then(res => {
    resp.json(msgResult.msg(res));
  }).catch(e => console.log(e))
})


app.listen(8888, () => {
  console.log("开启成功：http://localhost:8888");
  // reptile.saveJobs();
});