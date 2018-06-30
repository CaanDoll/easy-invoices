import sq3 from 'sqlite3';

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.serialize(function() {
  db.run('CREATE TABLE GOODS(' +
    'id INT PRIMARY KEY,' +
    'name VARCHAR,' +
    'buy_price DOUBLE PRECISION,' +
    'sell_price DOUBLE PRECISION,' +
    'total INT,' +
    'remark VARCHAR' +
    ')');

  db.run('CREATE TABLE GOODS_RECORD(' +
    'id INT PRIMARY KEY,' +
    'name VARCHAR,' +
    'buy_price DOUBLE PRECISION,' +
    'sell_price DOUBLE PRECISION,' +
    'total INT,' +
    'remark VARCHAR' +
    ')');
});

db.close();
