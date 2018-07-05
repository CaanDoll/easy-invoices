import sq3 from 'sqlite3';
import logger from './logger';
const sqlite3 = sq3.verbose();
const db = new sqlite3.Database('./db.sqlite3');

/**
 * name 品名
 * buy_price 进价
 * sell_price 售价
 * total 数量
 * remark 备注
 * createTime 创建时间
 * updateTime 修改时间
 */
db.serialize(() => {
  db.run('CREATE TABLE GOODS(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name TEXT NOT NULL,' +
    'buy_price REAL NOT NULL,' +
    'sell_price REAL NOT NULL,' +
    'total INTEGER NOT NULL,' +
    'remark TEXT NOT NULL,' +
    'create_time INTEGER NOT NULL,' +
    'update_time INTEGER NOT NULL' +
    ')', err => {
    logger(err);
  });


  /* db.run('CREATE TABLE GOODS_RECORD(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name TEXT NOT NULL,' +
    'buy_price REAL NOT NULL,' +
    'sell_price REAL NOT NULL,' +
    'total INTEGER NOT NULL,' +
    'remark TEXT NOT NULL' +
    ')'); */
})
;

export default db;
