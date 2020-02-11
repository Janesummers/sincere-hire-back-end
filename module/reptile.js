const http = require('http');
const https = require('https');
const iconv = require('iconv-lite');
const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const phantom = require('phantom');
const cheerio = require('cheerio');

let getPracticeData = (req, resp) => {

  let sitepage = null; //创建网页对象实例
  let phInstance = null; //创建phantomj实例对象
  phantom.create()
  .then(instance => {
      phInstance = instance;
      return instance.createPage();
  })
  .then(page => {
      sitepage = page;
      return page.open('https://sou.zhaopin.com/?jl=681&in=100030000&kw=%E5%AE%9E%E4%B9%A0&kt=3');
  })
  .then(status => {
      console.log(status); //获取结果状态
      return sitepage.property('content'); //获取相应的属性内容
  })
  .then(content => { 
      // console.log(content)
      const $ = cheerio.load(content);  //解析输出的结果内容
      const jsonResult = [];
      // $('a[href]').each((i, item) => {  //抓取符合条件的a标签的链接地址
      //     const href = $(item).attr('href');
      //     if (new RegExp(/http[s]?:\/\/.*/).test(href)) {
      //         jsonResult.push(href);
      //     }
      // });
      console.log($('#listContent').find('.contentpile__content__wrapper').length)
      sitepage.close();
      phInstance.exit();
      resp.json(jsonResult);
  })
  .catch(error => {
      console.log(error);
      phInstance.exit();
      resp.json({status: false});
  });
    
  // function save2 (text) {
  //   mysqlOpt.exec(
  //     `insert into content
  //       values (?,?,?,?,?,?)`,
  //     mysqlOpt.formatParams(null, news[i].docid, text, 0, news[i].url, news[i].ptime),
  //     res => {
  //       if (len > 0) {
  //         len--;
  //         i++;
  //         save1();
  //       } else {
  //         console.log("ok");
  //         resp.json(msgResult.msg(res));
  //       }
  //     },
  //     e => {
  //       console.log(msgResult.error(e.message));
  //       resp.end()
  //     }
  //   )
  // }

}


module.exports = {
  getPracticeData
}