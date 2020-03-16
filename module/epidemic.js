const https = require('https');
const msgResult = require('./msgResult');

let getEpidemic = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getEpidemic');

  let url = 'https://aweme.snssdk.com/web/api/v2/special/pneumonia/map/?forum_id=1656784762444839&is_web_refresh=1&api_version=6'
  
  https.get(url, data => {
    var str="";
    data.on("data",function(chunk){
        str+=chunk; //监听数据响应，拼接数据片段
    })
    data.on("end",function(){
      let data = JSON.parse(str.toString());
      resp.json(msgResult.msg(data.data));
    })
  });
}

module.exports = {
  getEpidemic
}