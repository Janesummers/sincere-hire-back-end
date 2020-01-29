const fs = require('fs');

function save (msg, client, to, time) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time
  };
  data = JSON.stringify(data, null, 2);
  
  if (!fs.existsSync(`${client}_${to}.json`) && !fs.existsSync(`${to}_${client}.json`)) {
    fs.writeFileSync(`${client}_${to}.json`, data);
    return `${client}_${to}.json`;
  } 
  
  if (fs.existsSync(`${client}_${to}.json`)) {
    fs.appendFileSync(`${client}_${to}.json`, `,${data}`);
    return `${client}_${to}.json`;
  }

  if (fs.existsSync(`${to}_${client}.json`)) {
    fs.appendFileSync(`${to}_${client}.json`, `,${data}`);
    return `${to}_${client}.json`;
  }
  
}

module.exports = {
  save
}