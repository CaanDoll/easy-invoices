import Goods from './goods';
import GoodsDetailList from './goods_detail_list';
import sequelize from '../db';
import logger from '../logger';
// 物品 进出明细 一对多
Goods.hasMany(GoodsDetailList, { foreignKey: 'goods_id' });
GoodsDetailList.belongsTo(Goods, { foreignKey: 'goods_id' });

// 建表
sequelize.sync().then(() => {
  logger('init db ok');
}).catch(err => {
  logger(err);
});


export default {
  Goods,
  GoodsDetailList,
};
