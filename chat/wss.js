const http = require('http');
const ws = require('ws');
const fs = require('fs');
const Base64 = require('js-base64').Base64;
const message = require('./message');

function runServer () {
  //要是单纯的https连接的话就会返回这个东西
  const server = http.createServer((req, res) => {
    res.writeHead(403); //403即可
    res.end("This is a WebSockets server!\n");
  }).listen(8085, () => {
      console.log('启动成功')
  });

  //把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
  const wss = new ws.Server( { server: server } );

  wss.on('connection', function connection(ws, req) {
    let unionid = req.headers.unionid;
    unionid = Base64.decode(unionid)
    ws.unionid = unionid;
    console.log('连接成功', `数量：${Array.from(wss.clients).length}`);
    wss.clients.forEach((client) => {
      console.log(client.unionid)
    });
    //客户端发送消息时会触发这个
    ws.on('message', function incoming(data) {
      let {msg, client, to, time, name, type, read} = JSON.parse(data);
      if (msg != '系统任务：更新消息为已读') {
        let filename = message.save(msg, client, to, time, type, read);
        let data2 = fs.readFileSync(filename, 'utf8');
        to = Base64.decode(to);
        client = Base64.decode(client);
        console.log('收到消息', msg, '来自：', client, '发送给：', to);
        //data是客户端发送的消息，这里clients.foreach是广播给所有客户端
        wss.clients.forEach((client) => {
          if (client.unionid === to) {
            let messages = {
              msg,
              all: data2.toString(),
              sendUser: name,
              type
            };
            messages = JSON.stringify(messages);
            client.send(messages);
          }
        });
      } else {
        message.updateRead(client, to);
      }
    });
  });
}

module.exports = {
  runServer
}