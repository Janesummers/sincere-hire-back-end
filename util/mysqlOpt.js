const os = require('os');
console.log('os', os.type());
let mysql = require('mysql');
if (os.type() == 'Darwin') {
	//mac
  mysql = require('mysql2');
}
if (os.type() == 'Linux') {
	//Linux平台
}
let pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'janesummer1175',
  port: '3306',
  database: 'qz'
});

function getConnection(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      callback && callback(connection);
    }
  });
}

/**
 * 执行增删改查
 * @param sql
 * @param params
 * @param success
 * @param error
 */
function exec (sql, params, success, error) {
  getConnection((conn) => {
    conn.query(sql, params, (e, result) => {
      conn.release();
      if (e) {
        console.log(e.message);
        error && error(e);
      } else {
        success && success(result);
      }
    });
  });
}

/**
 * 格式化可选参数
 */
function formatParams () {
  console.log("请求参数：", Array.from(arguments));
  return Array.from(arguments);
};

module.exports = {
  exec,
  formatParams
};
