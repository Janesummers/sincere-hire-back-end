const qs = require('qs');
const msgResult = require('./msgResult');
const mysqlOpt = require('../util/mysqlOpt');
const util = require('../util/util');

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
    sql = `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type, u.nickname as publisher_name
    from jobs as job, company as comp, user as u
    where job.empl_type = ? and job.company_id = comp.company_id and job.publisher_id = u.unionid limit ?, ?`;
    data = mysqlOpt.formatParams(emplType, (page - 1) * num, num);
  } else {
    sql = `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type, u.nickname as publisher_name
    from jobs as job, company as comp, user as u
    where job.company_id = comp.company_id and job.publisher_id = u.unionid limit ?, ?`;
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
    `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type, u.nickname as publisher_name
     from jobs as job, company as comp, user as u
     where job.job_name like ? and job.company_id = comp.company_id and job.publisher_id = u.unionid limit ?, ?`,
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
    `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type, u.nickname as publisher_name
     from jobs as job, company as comp, collect as col, user as u
     where job.job_id = col.job_id and job.company_id = comp.company_id and col.unionid and job.publisher_id = u.unionid = ?`,
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

let saveJob = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let data = qs.parse(req.body);

  console.log('用户请求：saveJob');

  let t = util.getTime();
  let d = new Date(t);
  let job_id = `CC${d.getTime()}${t.match(/[^\s]+/)[0].replace(/-/g, '')}`;
  let update_date = t;
  let {
    company_id,
    job_name,
    job_type,
    empl_type,
    working_exp,
    welfare,
    city,
    display,
    skill,
    other_require,
    salary,
    edu_level,
    job_address,
    recruit
  } = data;

  if (welfare == 'null') {
    welfare = null;
  }
  if (skill == 'null') {
    skill = null;
  }

  mysqlOpt.exec(
    `insert into jobs 
     values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    mysqlOpt.formatParams(
      job_id,
      company_id,
      job_name,
      job_type,
      empl_type,
      working_exp,
      welfare,
      welfare,
      city,
      display,
      salary,
      skill,
      other_require,
      job_address,
      recruit,
      unionid,
      edu_level,
      update_date),
    (res) => {
      resp.json(msgResult.msg('ok'))
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error(e.message))
    }
  );
}

let getMyRelease = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('用户请求：getMyRelease');

  mysqlOpt.exec(
    `select job.*, comp.company_name, comp.size as company_size, comp.type as company_type
    from jobs as job, company as comp
     where publisher_id = ? and job.company_id = comp.company_id and job.company_id = ?`,
    mysqlOpt.formatParams(unionid, req.query.company_id),
    (res) => {
      resp.json(msgResult.msg(res))
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error(e.message))
    }
  );
}

module.exports = {
  getPracticeJobs,
  searchJob,
  getCollect,
  setCollect,
  getUserCollect,
  saveJob,
  getMyRelease
}