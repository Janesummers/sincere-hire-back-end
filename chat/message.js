const fs = require('fs');
const path = require('path');

function save (msg, client, to, time) {
  let paths = path.join(__dirname,`../record`);
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time
  };
  data = JSON.stringify(data, null, 2);
  
  if (!fs.existsSync(`${paths}/${client}_${to}.json`) && !fs.existsSync(`${paths}/${to}_${client}.json`)) {
    fs.writeFileSync(`${paths}/${client}_${to}.json`, data);
    return `${paths}/${client}_${to}.json`;
  } 
  
  if (fs.existsSync(`${paths}/${client}_${to}.json`)) {
    fs.appendFileSync(paths, `,${data}`);
    return `${paths}/${client}_${to}.json`;
  }

  if (fs.existsSync(`${paths}/${to}_${client}.json`)) {
    fs.appendFileSync(`${paths}/${to}_${client}.json`, `,${data}`);
    return `${paths}/${to}_${client}.json`;
  }
  
}

module.exports = {
  save
}