const fs = require('fs');
const path = require('path');

function save (msg, client, to, time, type, read) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time,
    type,
    read
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

function updateRead (client, to) {
  let savePath = path.join(__dirname, '../static/chats');
  if (fs.existsSync(`${savePath}/${client}_${to}.json`)) {
    let data = JSON.parse(`[${fs.readFileSync(`${savePath}/${client}_${to}.json`, 'utf8')}]`);
    data.forEach(item => {
      item.read = true;
    })
    data = JSON.stringify(data).match(/(?<=\[).+(?=\])/);
    fs.writeFileSync(`${savePath}/${client}_${to}.json`, data);
  }

  if (fs.existsSync(`${savePath}/${to}_${client}.json`)) {
    let data = JSON.parse(`[${fs.readFileSync(`${savePath}/${to}_${client}.json`, 'utf8')}]`);
    data.forEach(item => {
      item.read = true;
    })
    data = JSON.stringify(data).match(/(?<=\[).+(?=\])/);
    fs.writeFileSync(`${savePath}/${to}_${client}.json`, data);
  }
}

module.exports = {
  save,
  updateRead
}