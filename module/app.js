const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const websocket = require('../chat/wss.js');
const multer  = require('multer')
const upload = multer({ dest: './tmp/' })

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.disable('x-powered-by');

websocket.runServer();


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

app.post("/saveJobSeeker", (req, resp) => {
  user.saveJobSeeker(req, resp);
});

app.post("/saveRecruiter", (req, resp) => {
  user.saveRecruiter(req, resp);
});

app.post("/userAvatarUrl", upload.single('file'), (req, resp) => {
  user.userAvatarUrl(req, resp);
});

app.get("/userAvatar/:name", (req, resp) => {
  user.userAvatar(req, resp);
});

app.post("/saveUserInfo", (req, resp) => {
  user.saveUserInfo(req, resp);
})

app.get('/getUserEducation', (req, resp) => {
  user.getUserEducation(req, resp);
})

app.post('/addEducation', (req, resp) => {
  user.addEducation(req, resp);
})

app.post('/changeEducation', (req, resp) => {
  user.changeEducation(req, resp);
})

app.post('/delEducation', (req, resp) => {
  user.delEducation(req, resp);
})

app.get('/getUserInfo', (req, resp) => {
  user.getUserInfo(req, resp);
})

app.post('/addWorkExperience', (req, resp) => {
  user.addWorkExperience(req, resp);
})

app.post('/changeWorkExperience', (req, resp) => {
  user.changeWorkExperience(req, resp);
})

app.post('/delWorkExperience', (req, resp) => {
  user.delWorkExperience(req, resp);
})

app.get('/getUserWork', (req, resp) => {
  user.getUserWork(req, resp);
});

app.post('/saveEvaluate', (req, resp) => {
  user.saveEvaluate(req, resp);
});

app.get('/getUserResume', (req, resp) => {
  user.getUserResume(req, resp);
})

const openData = require('./openData');

app.get("/getCity", (req, resp) => {
  openData.getCity(req, resp);
});

app.get("/getSchool", (req, resp) => {
  openData.getSchool(req, resp);
});

app.get("/getMajor", (req, resp) => {
  openData.getMajor(req, resp);
});

const msg = require('./msg');
app.post("/getMessageList", (req, resp) => {
  msg.getMessageList(req, resp);
});

app.post("/getMessage", (req, resp) => {
  msg.getMessage(req, resp);
})

app.post("/saveMessageList", (req, resp) => {
  msg.saveMessageList(req, resp);
})

const reptile = require('./reptile');
app.post('/saveJobInfo', (req, resp) => {
  reptile.saveJobInfo(req, resp);
})

const jobs = require('./jobs');
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



app.listen(8888, () => {
  console.log("开启成功：http://localhost:8888");
  // reptile.saveJobs();
});