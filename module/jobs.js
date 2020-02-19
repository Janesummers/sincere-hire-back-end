const qs = require('qs');
const msgResult = require('./msgResult');
const mysqlOpt = require('../util/mysqlOpt');

var getPracticeJobs = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getPracticeJobs');
  let {
    emplType,
    num = 10,
    page = 1
  } = qs.parse(req.body);
  num = parseInt(num);
  page = parseInt(page);
  let sql = '';
  let data;
  if (emplType) {
    sql = `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type
    from jobs as job, company as comp 
    where job.empl_type = ? and job.company_id = comp.company_id limit ?, ?`;
    data = mysqlOpt.formatParams(emplType, (page - 1) * num, num);
  } else {
    sql = `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type
    from jobs as job, company as comp 
    where job.company_id = comp.company_id limit ?, ?`;
    data = mysqlOpt.formatParams((page - 1) * num, num);
  }
  
  // resp.json(msgResult.msg([]))
  mysqlOpt.exec(
    sql,
    data,
    (res) => {
      console.log(res)
      resp.json(msgResult.msg(res))
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取异常'));
    }
  );
}

let searchJob = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：searchJob');
  let {
    keyWord,
    num = 10,
    page = 1
  } = qs.parse(req.body);
  num = parseInt(num);
  page = parseInt(page);
  keyWord = `%${keyWord}%`;
  
  // resp.json(msgResult.msg([]))
  mysqlOpt.exec(
    `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type
     from jobs as job, company as comp 
     where job.job_name like ? and job.company_id = comp.company_id limit ?, ?`,
    mysqlOpt.formatParams(keyWord, (page - 1) * num, num),
    (res) => {
      console.log(res)
      resp.json(msgResult.msg(res))
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('搜索异常'));
    }
  );
}

let getCollect = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getCollect');

  mysqlOpt.exec(
    `select job_id from collect where unionid = ?`,
    mysqlOpt.formatParams(unionid),
    (res) => {
      resp.json(msgResult.msg(res));
      return;
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('接口异常'));
    }
  );
  
}

let getUserCollect = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getUserCollect');

  mysqlOpt.exec(
    `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type
     from jobs as job, company as comp, collect as col 
     where job.job_id = col.job_id and job.company_id = comp.company_id and col.unionid = ?`,
    mysqlOpt.formatParams(unionid),
    (res) => {
      resp.json(msgResult.msg(res));
      return;
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error('获取失败'));
    }
  );
  
}

let setCollect = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：setCollect');
  let {
    job_id,
    collectData
  } = req.query;
  // collectData = collectData == '0' ? 1 : 0;
  // resp.json(msgResult.msg('ok'));
  if (collectData == '0') {
    mysqlOpt.exec(
      `insert into collect (unionid, job_id)
       values (?,?)`,
      mysqlOpt.formatParams(unionid, job_id),
      (res) => {
        resp.json(msgResult.msg('ok'));
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error('收藏失败'));
      }
    );
  } else {
    mysqlOpt.exec(
      `delete from collect
       where unionid = ? and job_id = ?`,
      mysqlOpt.formatParams(unionid, job_id),
      (res) => {
        resp.json(msgResult.msg('ok'));
        return;
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error('收藏失败'));
      }
    );
  }
  
}

module.exports = {
  getPracticeJobs,
  searchJob,
  getCollect,
  setCollect,
  getUserCollect
}