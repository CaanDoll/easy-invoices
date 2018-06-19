import Loki from 'lokijs';
import path from 'path';

const db = new Loki(path.join(__dirname, 'db.json'), {
  autosave: true,
  autoload: true,
  autoloadCallback: () => {
    console.log('数据加载成功');
  },
  autosaveInterval: 1000, // 1 second
  env: 'NODEJS',
});

const goods = db.addCollection('goods');
const records = db.addCollection('records');

export default {
  goods,
  records,
};
