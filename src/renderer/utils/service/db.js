import sq3 from 'sqlite3';

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.serialize(() => {
  db.run('CREATE TABLE GOODS(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name TEXT NOT NULL,' +
    'buy_price REAL NOT NULL,' +
    'sell_price REAL NOT NULL,' +
    'total INTEGER NOT NULL,' +
    'remark TEXT NOT NULL' +
    ')');

  /* db.run('CREATE TABLE GOODS_RECORD(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name TEXT NOT NULL,' +
    'buy_price REAL NOT NULL,' +
    'sell_price REAL NOT NULL,' +
    'total INTEGER NOT NULL,' +
    'remark TEXT NOT NULL' +
    ')'); */
});

export default db;
