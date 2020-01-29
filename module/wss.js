// const  https=require('https'); 
// const url=require('url');
// const fs=require('fs');
// var WebSocket=require('ws');
// var server =https.createServer().listen(8085);
// var wss=new WebSocket.Server({ server:server });

// wss.broadcast=function broadcast() {
//     wss.clients.forEach(function each (client) {
//         if(client.readyState==WebSocket.OPEN){
//             client.send("开始通信吧！");
//         }
//     })
// }
// wss.on('connection',function connection(ws,req) {
//     var s;
//     //const location = url.parse(req.url, true);
//     ws.on('message',function incoming(message) {
//         console.log(message);
//         var smg = JSON.parse(message);
//         console.log(smg.msg + " " + smg.name);
//         if(smg.msg!="") {
//             s = smg.name + "说：" + smg.msg;
//             ws.send(s);
//         }else {
//             ws.send("说些什么吧，别这么高冷呀")
//         }
//     });
//     wss.broadcast();
// })

const https = require('http');
const ws = require('ws');
const fs = require('fs');
const path = require('path');
// const keypath = path.resolve(__dirname, "./www.chiens.cn.key");
// const certpath= path.resolve(__dirname, "./1_www.chiens.cn_bundle.crt");

// const options = {
//   key: fs.readFileSync(keypath),
//   cert: fs.readFileSync(certpath)
// };

//要是单纯的https连接的话就会返回这个东西
const server = https.createServer(function (req, res) {
 res.writeHead(403); //403即可
 res.end("This is a WebSockets server!\n");
}).listen(8085, () => {
    console.log('启动成功')
});

//把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
var wss = new ws.Server( { server: server, path: '/chat' } );

//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
wss.on( 'connection', function ( wsConnect ) {
  console.log('连接成功')
  wsConnect.on( 'message', function ( message ) {
    console.log( message );
  });
});