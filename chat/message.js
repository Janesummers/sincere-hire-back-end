const fs = require('fs');
const path = require('path');
const mysqlOpt = require('../util/mysqlOpt');
const msgResult = require('../module/msgResult');
const util = require('../util/util');

function save (msg, client, to, time, type, read, invite_id) {
  let data = {
    data: msg,
    sendId: client,
    acceptId: to,
    time,
    type,
    read,
    invite_id
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

let invitation = (client, to, time, invite_id, other) => {
  queryJob();
  function queryJob () {
    mysqlOpt.exec(
      `select * from jobs where job_id = ?`,
      mysqlOpt.formatParams(other.job_id),
      (res) => {
        insert(res);
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
      }
    );
  }
  function insert (res) {
    let job = JSON.parse(JSON.stringify(res))[0];
    mysqlOpt.exec(
      `insert into invite_interview
      values (?,?,?,?,?,?,?,?,?,?,?)`,
      mysqlOpt.formatParams(null, invite_id, to, client, `${other.interDate} ${other.interTime}`, other.sendCompany , job.job_name, job.job_address, other.interText, 0, time),
      (res) => {
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
      }
    );
  }
}

module.exports = {
  save,
  updateRead,
  invitation
}