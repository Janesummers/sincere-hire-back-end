const fs = require('fs');
function save (msg, client, to) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time: ''
  };
  data = JSON.stringify(data, null, 2);
  let filename = '';
  
  if (!fs.existsSync(`${client}_${to}.json`) && !fs.existsSync(`${to}_${client}.json`)) {
    fs.writeFileSync(`${client}_${to}.json`, data);
    filename = `${client}_${to}.json`;
    return filename;
  } 
  
  if (fs.existsSync(`${client}_${to}.json`)) {
    fs.appendFileSync(`${client}_${to}.json`, `,${data}`);
    filename = `${client}_${to}.json`;
    return filename;
  }

  if (fs.existsSync(`${to}_${client}.json`)) {
    fs.appendFileSync(`${to}_${client}.json`, `,${data}`);
    filename = `${to}_${client}.json`;
    return filename;
  }
  
}

module.exports = {
  save
}