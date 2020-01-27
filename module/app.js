const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const Base64 = require('js-base64').Base64;

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.disable('x-powered-by');

//引入ws模块

//创建服务 port是端口
// const wss = new WebSocket.Server({ port: 8085});
const wss = new WebSocket.Server({ noServer: true, port: 8085 });
//客户端连接时会进这个
wss.on('connection', function connection(ws, req) {
  let unionid = req.headers.unionid;
  unionid = Base64.decode(unionid)
  ws.unionid = unionid;
  console.log('连接成功', `数量：${Array.from(wss.clients).length}`);
  //客户端发送消息时会触发这个
  ws.on('message', function incoming(data) {
    let {msg, client, to} = JSON.parse(data);
    to = Base64.decode(to);
    client = Base64.decode(client);
    console.log('收到消息', msg, '来自：', client, '发送给：', to);
    //data是客户端发送的消息，这里clients.foreach是广播给所有客户端
    wss.clients.forEach((client) => {
      if (client.unionid === to) {
        client.send(msg);
      }
    });
  });
});

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

// 注册
app.post("/regist", (req, resp) => {
  user.register(req, resp);
});

// 获取图片
const images = require('./imgs');
app.post("/getImgs", (req, resp) => {
  images.getImages(req, resp);
});

// app.post("/setImgs", (req, resp) => {
//   images.setImages(req, resp);
// });

// 获取新闻
const news = require('./news');
app.post('/getNewsByPage', (req, resp) => {
  news.getList(req, resp);
});

app.post('/saveNews', (req, resp) => {
  news.saveNewList(req, resp);
});

// 
app.post('/getImgContentById', (req, resp) => {
  news.getNewsInfo(req, resp);
});

app.post('/updateImgContentHitsById', (req, resp) => {
  news.updateHits(req, resp);
});

const pictureShare = require('./pictureShare');
app.post('/getImgNavigate', (req, resp) => {
  pictureShare.getNavigate(req, resp);
});


const goods = require('./goods');
app.post('/getGoods', (req, resp) => {
  goods.getGoods(req, resp)
});

app.post('/setGoods', (req, resp) => {
  goods.setGoods(req, resp)
});

app.post('/delGoods', (req, resp) => {
  goods.delGoods(req, resp)
});

// app.post('/saveGoodsDetail', (req, resp) => {
//   goods.saveGoodsDetail(req, resp)
// });

app.post('/getOnceGoods', (req, resp) => {
  goods.getOnceGoods(req, resp);
})

app.post('/alterGoods', (req, resp) => {
  goods.alterGoods(req, resp);
})


app.post('/getMyGoods', (req, resp) => {
  goods.getMyGoods(req, resp);
});

app.post('/getMyShopCart', (req, resp) => {
  goods.getMyShopCart(req, resp);
})

app.post('/addToCar', (req, resp) => {
  goods.addToCar(req, resp);
});

app.post('/updateForCar', (req, resp) => {
  goods.updateCard(req, resp);
});

app.post('/deleteMyGoodsById', (req, resp) => {
  goods.delMyGoods(req, resp);
});

app.post('/payForGoods', (req, resp) => {
  goods.payForGoods(req, resp);
});

app.post('/clearAllMyGoods', (req, resp) => {
  goods.clearAllMyGoods(req, resp);
});


const comments = require('./comment');
app.post('/getCommentByPage', (req, resp) => {
  comments.getComments(req, resp);
});

app.post('/addComment', (req, resp) => {
  comments.addComment(req, resp);
});

app.post('/getUserComments', (req, resp) => {
  comments.getUserComments(req, resp);
})

const movie = require("./movie");
// app.post("/saveMovie", (req, resp) => {
//   movie.saveMovie(req, resp);
// });
app.post("/getMovie", (req, resp) => {
  movie.getMovie(req, resp);
});
app.post("/getMovieInfo", (req, resp) => {
  movie.getMovieInfo(req, resp);
});



app.listen(8888, () => {
  console.log("开启成功：http://localhost:8888");
});