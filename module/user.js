const mysqlOpt = require('../util/mysqlOpt');
const qs = require('qs');
const msgResult = require('./msgResult');
const https = require('https');
const fs = require('fs');
const path = require('path');
const util = require('../util/util');



var login = (req, resp) => {
  // console.log(req)
  let data = qs.parse(req.body);
  let code = data.code;
  let code2Session;
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx2bca6a5670f63aee&secret=993e926ab9679531fb2a612190eab04d&js_code=${code}&grant_type=authorization_code`;
  
  getSessionKey();
  function getSessionKey (id) {
    console.log('id', id);
    https.get(url, data => {
      var str="";
      data.on("data",function(chunk){
          str+=chunk; //监听数据响应，拼接数据片段
      })
      data.on("end",function(){
        console.log(str.toString())
        code2Session = JSON.parse(str.toString());
        console.log('code2Session', code2Session);
        console.log(code2Session.openid)
        getUser();
        
        function getUser () {
          mysqlOpt.exec(
            `select *
             from user
             where openId = ?`,
            mysqlOpt.formatParams(code2Session.openid || id),
            (res) => {
              if (res.length > 0) {
                if (res[0].rule == 0) {
                  
                  mysqlOpt.exec(
                    `select u.*, edu.school, edu.major
                     from user as u, user_education as edu
                     where u.openId = ? and u.unionid = edu.unionid limit 1`,
                    mysqlOpt.formatParams(code2Session.openid || id),
                    (res2) => {
                      if (res2.length > 0) {
                        resp.json(msgResult.msg(res2));
                      }
                      return;
                    },
                    e => {
                      console.log(msgResult.error(e.message));
                      resp.json(msgResult.error(e.message));
                    }
                  );

                } else {
                  resp.json(msgResult.msg(res));
                }
              } else {
                getId();
              }
              return;
            },
            e => {
              console.log(msgResult.error(e.message));
              resp.json(msgResult.error(e.message));
            }
          );
        }
      })
    });
  }

  function getId () {
    const WXBizDataCrypt = require('../util/WXBizDataCrypt');
    var appId = 'wx2bca6a5670f63aee';
    var sessionKey = code2Session.session_key;
    var encryptedData = decodeURIComponent(data.encryptedData);
    var iv = decodeURIComponent(data.iv);
    var pc = new WXBizDataCrypt(appId, sessionKey);

    var codes = '';

    try {
      console.log("妈卖批", encryptedData, iv);
      codes = pc.decryptData(encryptedData , iv);
    } catch (e) {
      // console.log('重复申请引发错误，重新获取');
      console.log(e.message)
      resp.json(msgResult.error("Illegal Buffer"));
      return;
    }

    console.log('解密后 data: ', codes);

    saveUserId(codes.unionId);

  }
  
  function saveUserId (unionid) {
    console.log("unionid->>>>", unionid)
    mysqlOpt.exec(
      "insert into user (unionid,openId) values (?,?)",
      mysqlOpt.formatParams(unionid, code2Session.openid),
      () => {
        resp.json(msgResult.msg({
          unionid
        }));
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("用户数据保存错误"));
      }
    );
  }

};

var saveJobSeeker = (req, resp) => {
  let query = qs.parse(req.body);
  let {name, birthday, sex, email, city, identity, school, major, education, time_enrollment, time_graduation, advantage, jobTime, rule} = query;
  let unionid = req.query.unionid;
  rule = parseInt(rule);
  saveBasic();
  function saveBasic () {
    mysqlOpt.exec(
      `update user
       set nickname = ?,birthday = ?,sex = ?,email = ?,city = ?,identity = ?,advantage = ?,jobTime = ?,rule = ?
       where unionid = ?`,
      mysqlOpt.formatParams(name, birthday, sex, email, city, identity, advantage, jobTime,rule, unionid),
      (res) => {
        saveEducation();
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("用户数据保存错误"));
      }
    );
  }

  function saveEducation () {
    mysqlOpt.exec(
      `insert into user_education
       (unionid,school,major,education,time_enrollment,time_graduation)
       values (?,?,?,?,?,?)
      `,
      mysqlOpt.formatParams(unionid, school, major, education, time_enrollment, time_graduation),
      (res) => {
        resp.json(msgResult.msg({
          name, birthday, sex, email, city, identity, advantage, school, major, jobTime, rule
        }));
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("用户数据保存错误"));
      }
    );
  }

}

var saveRecruiter = (req, resp) => {
  let query = qs.parse(req.body);
  let {name, sex, email, position, company, type, scale, rule} = query;
  let unionid = req.query.unionid;
  rule = parseInt(rule);
  let company_id = "QZ" + parseInt(new Date().getTime() / 10000);
  mysqlOpt.exec(
    `update user
     set nickname = ?,sex = ?,email = ?,position = ?,company_id = ?,rule = ?
     where unionid = ?`,
    mysqlOpt.formatParams(name, sex, email, position, company_id, rule, unionid),
    (res) => {
      insertCompany();
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );

  function insertCompany () {
    mysqlOpt.exec(
      `insert into company
       values (?,?,?,?)`,
      mysqlOpt.formatParams(company_id, company, scale, type),
      (res) => {
        resp.json(msgResult.msg({
          name, sex, email, position, company_id, scale, rule
        }));
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("用户数据保存错误"));
      }
    );
  }

}

var userAvatarUrl = (req, resp) => {
  let query = qs.parse(req.body);
  let filePath = './' + req.file.path; 
  let fileType = req.file.mimetype;
  let lastName = '';
  switch(fileType) {
    case 'image/png': 
      lastName = '.png';
      break;
    case 'image/jpeg': 
      lastName = '.jpg';
      break;
    default: 
      lastName = '.png';
      break;
  }
  let fileName = query.unionid + Date.now() + lastName;
  let unionid = Base64.decode(query.unionid);
  fs.rename(filePath, path.join(__dirname, '../static/upload/' + fileName), (err) => {
    if (err) {
      resp.json(msgResult.error("上传失败"));
    }else{
      mysqlOpt.exec(
        `update user
         set avatarUrl = ?
         where unionid = ?`,
        mysqlOpt.formatParams(fileName, unionid),
        (res) => {
          resp.json(msgResult.msg({
            text: "上传成功",
            img: fileName
          }));
        },
        e => {
          console.log(msgResult.error(e.message));
          resp.json(msgResult.error("上传失败"));
        }
      );
    }
  });
  
}

var userAvatar = (req, resp) => {
  var options = {
    root: path.join(__dirname, '../static/upload/'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  var fileName = req.params.name;
  resp.sendFile(fileName, options, (err) => {
    if (err) {
      console.log(err);
      resp.json(msgResult.error(err.status));
    } else {
      console.log('Sent:', fileName);
    }
  });
}

var saveUserInfo = (req, resp) => {
  let unionid = req.query.unionid;
  let query = qs.parse(req.body);
  let {name, sex, birthday, jobTime, city, email} = query;
  if (!unionid || unionid.length != 28 || !name || !sex || !birthday || !jobTime || !city || !email) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  mysqlOpt.exec(
    `update user
     set nickname = ?,birthday = ?,sex = ?,email = ?,city = ?,jobTime = ?
     where unionid = ?`,
    mysqlOpt.formatParams(name, birthday, sex, email, city, jobTime, unionid),
    (res) => {
      let changeRows = JSON.parse(JSON.stringify(res)).changedRows;
      if (changeRows > 0) {
        resp.json(msgResult.msg('更新成功'));
      } else {
        resp.json(msgResult.error('更新失败'));
      }
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );
}

var getUserEducation = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('time: ' + util.getTime() +  ' 用户请求：getUserEducation')

  mysqlOpt.exec(
    `select * from user_education
     where unionid = ?`,
    mysqlOpt.formatParams(unionid),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );

}

var addEducation = (req, resp) => {
  let unionid = req.query.unionid;
  let query = qs.parse(req.body);
  let {school, edu, major, time_enrollment, time_graduation} = query;
  if (!unionid || unionid.length != 28 || !school || !edu || !major || !time_enrollment || !time_graduation) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  mysqlOpt.exec(
    `insert into 
    user_education(unionid,school,major,education,time_enrollment,time_graduation)
    values(?,?,?,?,?,?)`,
    mysqlOpt.formatParams(unionid, school, major, edu, time_enrollment, time_graduation),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("教育信息保存错误"));
    }
  );
}

var changeEducation = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    school,
    edu,
    major,
    time_enrollment,
    time_graduation,
    edu_id
  } = qs.parse(req.body);

  console.log('time: ' + util.getTime() +  ' 用户请求：changeEducation')

  mysqlOpt.exec(
    `update user_education
    set school = ?,major = ?,education = ?,time_enrollment = ?,time_graduation = ?
    where unionid = ? and id = ?`,
    mysqlOpt.formatParams(school, major, edu, time_enrollment, time_graduation, unionid, edu_id),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("教育信息更新错误"));
    }
  );
}

var delEducation = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  let {
    edu_id
  } = qs.parse(req.body);

  console.log('time: ' + util.getTime() +  ' 用户请求：delEducation')

  mysqlOpt.exec(
    `delete from user_education
     where unionid = ? and id = ?`,
    mysqlOpt.formatParams(unionid, edu_id),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("教育信息删除错误"));
    }
  );
}

var getUserInfo = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('time: ' + util.getTime() +  ' 用户请求：getUserInfo')

  getInfo();

  function getInfo () {
    mysqlOpt.exec(
      `select nickname as name,avatarUrl,birthday,sex,email,city,identity,advantage,jobTime,position,company_id,rule
       from user
       where unionid = ?`,
      mysqlOpt.formatParams(unionid),
      (res) => {
        let info = JSON.parse(JSON.stringify(res));
        console.log('取得用户数据：', info[0])
        getOnceEducation(info[0]);
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("信息获取错误"));
      }
    );
  }

  function getOnceEducation (info) {
    mysqlOpt.exec(
      `select school,major
       from user_education
       where unionid = ?`,
      mysqlOpt.formatParams(unionid),
      (res) => {
        let data = JSON.parse(JSON.stringify(res))[0];
        if (data) {
          info.school = data.school;
          info.major = data.major;
          if (info.rule == 0) {
            info.rule = 'job_seeker'
          } else {
            info.rule = 'recruiter'
          }
          if (info.birthday) {
            let age = 0;
            let birthday = info.birthday.match(/[^\.]+/g);
            var year = parseInt(birthday[0]);
            var month = parseInt(birthday[1]);
            let date = new Date();
            if (month < date.getMonth() + 1) {
              age = new Date().getFullYear() - year;
            } else {
              age = new Date().getFullYear() - year - 1;
            }
            info.age = age;
          }
        }
        
        resp.json(msgResult.msg(info));
      },
      e => {
        console.log(msgResult.error(e.message));
        resp.json(msgResult.error("信息获取错误"));
      }
    );
  }
}

var addWorkExperience = (req, resp) => {
  let unionid = req.query.unionid;
  let query = qs.parse(req.body);
  let {
    name,
    position,
    hiredate,
    leavedate,
    industry,
    monthly_salary,
    job_description
  } = query;
  if (!unionid || unionid.length != 28 || !name || !position || !hiredate || !leavedate || !industry || !monthly_salary || !job_description) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  monthly_salary = parseInt(monthly_salary)

  mysqlOpt.exec(
    `insert into 
    work_experience(unionid,company_name,position,hiredate,leavedate,industry,salary,job_description)
    values(?,?,?,?,?,?,?,?)`,
    mysqlOpt.formatParams(unionid, name, position, hiredate, leavedate, industry, monthly_salary, job_description),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("工作经历信息保存错误"));
    }
  );
}

var changeWorkExperience = (req, resp) => {
  let unionid = req.query.unionid;
  let query = qs.parse(req.body);
  let {
    name,
    position,
    hiredate,
    leavedate,
    industry,
    monthly_salary,
    job_description,
    word_id
  } = query;

  if (!unionid || unionid.length != 28 || !name || !position || !hiredate || !leavedate || !industry || !monthly_salary || !job_description || !word_id) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  monthly_salary = parseInt(monthly_salary)

  mysqlOpt.exec(
    `update work_experience
     set company_name = ?,position = ?,hiredate = ?,leavedate = ?,industry = ?,salary = ?,job_description = ?
     where unionid = ? and id = ?`,
    mysqlOpt.formatParams(name, position, hiredate, leavedate, industry, monthly_salary, job_description, unionid, parseInt(word_id)),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("工作经历信息更新错误"));
    }
  );
}

var delWorkExperience = (req, resp) => {
  let unionid = req.query.unionid;
  let query = qs.parse(req.body);
  let {
    word_id
  } = query;

  if (!unionid || unionid.length != 28 || !word_id) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  mysqlOpt.exec(
    `delete from work_experience
     where unionid = ? and id = ?`,
    mysqlOpt.formatParams(unionid, parseInt(word_id)),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("工作经历信息删除错误"));
    }
  );
}

var getUserWork = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('time: ' + util.getTime() +  ' 用户请求：getUserWork')

  mysqlOpt.exec(
    `select * from work_experience
     where unionid = ?`,
    mysqlOpt.formatParams(unionid),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );
}


var saveEvaluate = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }
  let query = qs.parse(req.body);
  console.log('time: ' + util.getTime() +  ' 用户请求：saveEvaluate');

  mysqlOpt.exec(
    `update user set advantage = ?
     where unionid = ?`,
    mysqlOpt.formatParams(query.text, unionid),
    (res) => {
      resp.json(msgResult.msg('ok'));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("用户数据保存错误"));
    }
  );
}

let getUserResume = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }
  let query = req.query;
  console.log('time: ' + util.getTime() +  ' 用户请求：getUserResume');
  
  let getUserEdu = new Promise((resolve, reject) => {
    mysqlOpt.exec(
      `select * from user_education
       where unionid = ?`,
      mysqlOpt.formatParams(query.uid),
      (res) => {
        let data = JSON.parse(JSON.stringify(res));
        resolve(data);
      },
      e => {
        console.log(msgResult.error(e.message));
        reject(e.message);
      }
    );  
  })

  let getUserWork = new Promise((resolve, reject) => {
    mysqlOpt.exec(
      `select * from work_experience
       where unionid = ?`,
      mysqlOpt.formatParams(query.uid),
      (res) => {
        let data = JSON.parse(JSON.stringify(res));
        resolve(data);
      },
      e => {
        console.log(msgResult.error(e.message));
        reject(e.message);
      }
    );  
  })

  let getUserAdv = new Promise((resolve, reject) => {
    mysqlOpt.exec(
      `select advantage from user
       where unionid = ?`,
      mysqlOpt.formatParams(query.uid),
      (res) => {
        let data = JSON.parse(JSON.stringify(res));
        resolve(data);
      },
      e => {
        console.log(msgResult.error(e.message));
        reject(e.message);
      }
    );  
  });

  let getUserInfo = new Promise((resolve, reject) => {
    mysqlOpt.exec(
      `select nickname,birthday,sex,email from user
       where unionid = ?`,
      mysqlOpt.formatParams(query.uid),
      (res) => {
        let data = JSON.parse(JSON.stringify(res));
        resolve(data);
      },
      e => {
        console.log(msgResult.error(e.message));
        reject(e.message);
      }
    );  
  });

  let allDone = Promise.all([getUserEdu, getUserWork, getUserAdv, getUserInfo]);
  
  allDone.then(res => {
    console.log(res)
    let resume = {};
    resume.edu = res[0];
    resume.work = res[1];
    resume.adv = res[2][0].advantage || '';
    resume.userInfo = res[3];
    resp.json(msgResult.msg(resume));
  }).catch(err => {
    console.log(err);
    resp.json(msgResult.error("用户数据获取失败"));
  })

}

let getAvar = (req, resp) => {
  let unionid = req.query.unionid;
  if (!unionid || unionid.length != 28) {
    resp.json(msgResult.error("参数非法"));
    return;
  }

  console.log('time: ' + util.getTime() +  ' 用户请求：getAvar')
  let id = req.query.id;

  mysqlOpt.exec(
    `select unionid, avatarUrl from user where unionid = ? or unionid = ?`,
    mysqlOpt.formatParams(id, unionid),
    (res) => {
      resp.json(msgResult.msg(res));
    },
    e => {
      console.log(msgResult.error(e.message));
      resp.json(msgResult.error("获取双方头像错误"));
    }
  );
}




module.exports = {
  login,
  saveJobSeeker,
  saveRecruiter,
  userAvatarUrl,
  userAvatar,
  saveUserInfo,
  getUserEducation,
  getUserInfo,
  addEducation,
  addWorkExperience,
  getUserWork,
  saveEvaluate,
  changeWorkExperience,
  delWorkExperience,
  delEducation,
  changeEducation,
  getUserResume,
  getAvar
};
