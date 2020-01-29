const fs = require('fs');
const path = require('path');
let path1 = path.join(__dirname,`/chat/${client}_${to}.json`);
let path2 = path.join(__dirname,`/chat/${to}_${client}.json`);
function save (msg, client, to, time) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time
  };
  data = JSON.stringify(data, null, 2);
  
  if (!fs.existsSync(path1) && !fs.existsSync(path2)) {
    fs.writeFileSync(path1, data);
    return path1;
  } 
  
  if (fs.existsSync(path1)) {
    fs.appendFileSync(path1, `,${data}`);
    return path1;
  }

  if (fs.existsSync(path2)) {
    fs.appendFileSync(path2, `,${data}`);
    return path2;
  }
  
}

module.exports = {
  save
}