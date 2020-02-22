const fs = require('fs');
const path = require('path');

function save (msg, client, to, time) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time
  };
  data = JSON.stringify(data, null, 2);

  let savePath = path.join(__dirname, '../static/chats');
  // fs.writeFileSync(`${savePath}`, data);
  if (!fs.existsSync(`${savePath}/${client}_${to}.json`) && !fs.existsSync(`${savePath}/${to}_${client}.json`)) {
    fs.writeFileSync(`${savePath}/${client}_${to}.json`, data);
    return `${savePath}/${client}_${to}.json`;
  } 
  
  if (fs.existsSync(`${savePath}/${client}_${to}.json`)) {
    fs.appendFileSync(`${savePath}/${client}_${to}.json`, `,${data}`);
    return `${savePath}/${client}_${to}.json`;
  }

  if (fs.existsSync(`${savePath}/${to}_${client}.json`)) {
    fs.appendFileSync(`${savePath}/${to}_${client}.json`, `,${data}`);
    return `${savePath}/${to}_${client}.json`;
  }
}

module.exports = {
  save
}