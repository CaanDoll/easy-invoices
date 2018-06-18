import Loki from 'lokijs';
import path from 'path';

const db = new Loki(path.join(__dirname, 'db.json'));

const goods = db.addCollection('goods');

export default {
  goods,
};
