const qs = require('qs');
const fs = require('fs');
const path = require('path');
const msgResult = require('./msgResult');
const mysqlOpt = require('../util/mysqlOpt');

var saveJobInfo = (req, resp) => {
  let query = qs.parse(req.body)
  console.log('用户请求：saveJobInfo');
  let {
    id,
    position_window,
    describtion,
    job_address,
    recruit
  } = query;
  
  mysqlOpt.exec(
    `update jobs 
     set welfare_all = ?, skill_require = ?, other_require = ?, job_address = ?, recruit = ?
     where job_id = ?`,
    mysqlOpt.formatParams(
      position_window.content,
      describtion.skills_required.content,
      describtion.other,
      job_address,
      recruit,
      id
    ),
    (res) => {
      resp.json(msgResult.msg('ok'))
    },
    e => {
      console.log(msgResult.error(e.message));
    }
  );

  // console.log('成功');
}

var saveJobs = () => {
  console.log('用户请求：saveJobs');
  // console.log('路径', __dirname)
  let jobs = fs.readFileSync(path.join(__dirname, '../static/newJob.json'), {encoding: 'utf8'})
  jobs = JSON.parse(jobs).data.results;
  // console.log(jobs)
  let job = [];
  for (i in jobs) {
    var _job = jobs[i];
    job[i] = {};
    job[i].job_id = _job.number;
    job[i].company_id = _job.company.number;
    job[i].job_name = _job.jobName;
    job[i].job_type = _job.jobType.items[0].name;
    job[i].company_type = _job.company.type.name;
    job[i].company_name = _job.company.name;
    job[i].company_size = _job.company.size.name;
    job[i].empl_type = _job.emplType;
    job[i].working_exp = _job.workingExp.name;
    job[i].welfare = _job.welfare.toString().replace(/,/g, '|');
    job[i].city = _job.city.items[0].name;
    job[i].display = _job.city.display;
    job[i].salary = _job.salary;
    job[i].edu_level = _job.eduLevel.name;
    job[i].update_date = _job.updateDate;
  }
  // job
  // console.log(job)
  check(0);
  function check (n) {
    if (n < job.length) {
      mysqlOpt.exec(
        `select job_id from jobs
         where job_id = ?`,
        mysqlOpt.formatParams(job[n].job_id),
        (res) => {
          if (res.length < 1) {
            isCompany();
          } else {
            check(n + 1);
          }
        },
        e => {
          console.log(msgResult.error(e.message));
          // resp.json(msgResult.error("信息获取错误"));
        }
      );

      function isCompany () {
        mysqlOpt.exec(
          `select company_id from company
           where company_id = ?`,
          mysqlOpt.formatParams(job[n].company_id),
          (res) => {
            console.log(res)
            if (res.length < 1) {
              insert(n, true);
            } else {
              insert(n, false);
            }
          },
          e => {
            console.log(msgResult.error(e.message));
            // resp.json(msgResult.error("信息获取错误"));
          }
        );
      }

    } else {
      console.log('insert ok')
    }

    // console.log(JSON.parse(JSON.stringify(res))[0])
  }
  
  function insert (n, isCompany) {
    let {
      job_id,
      company_id,
      job_name,
      job_type,
      company_type,
      company_name,
      company_size,
      empl_type,
      working_exp,
      welfare,
      city,
      display,
      salary,
      edu_level,
      update_date
    } = job[n];
    if (welfare == '') {
      welfare = null;
    }
    let saveJob = new Promise ((resolve, reject) => {
      mysqlOpt.exec(
        `insert into jobs 
         (job_id,company_id,job_name,job_type,empl_type,working_exp,welfare,city,display,salary,edu_level,update_date)
         values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        mysqlOpt.formatParams(job_id,
          company_id,
          job_name,
          job_type,
          empl_type,
          working_exp,
          welfare,
          city,
          display,
          salary,
          edu_level,
          update_date),
        (res) => {
          resolve(res);
        },
        e => {
          console.log(msgResult.error(e.message));
          reject(e.message)
        }
      );
    })
    let saveJobCompany;
    let done;
    if (isCompany) {
      saveJobCompany = new Promise ((resolve, reject) => {
        mysqlOpt.exec(
          `insert into company 
           values (?,?,?,?)`,
          mysqlOpt.formatParams(
            company_id,
            company_name,
            company_size,
            company_type
            ),
          (res) => {
            resolve(res);
          },
          e => {
            console.log(msgResult.error(e.message));
            reject(e.message)
          }
        );
      })
      done = Promise.all([saveJob, saveJobCompany]);
    } else {
      done = Promise.all([saveJob]);
    }
    
    done.then(res => {
      console.log(res)
      if (res.length > 1) {
        let job = JSON.parse(JSON.stringify(res[0]))
        let companys = JSON.parse(JSON.stringify(res[0]))
        if (job.affectedRows > 0 && companys.affectedRows > 0) {
          check(n + 1)
        } else {
          console.log('错误')
        }
      } else {
        let job = JSON.parse(JSON.stringify(res[0]));
        if (job.affectedRows > 0) {
          check(n + 1)
        } else {
          console.log('错误')
        }
      }
      // check(n + 1)
    }).catch (e => {
      console.log(e);
    })
  }
}

module.exports = {
  saveJobInfo,
  saveJobs
}