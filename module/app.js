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



app.listen(8888, () => {
  console.log("开启成功：http://localhost:8888");
});