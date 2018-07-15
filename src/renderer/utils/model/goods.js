import sequelize from '../db';
import Sequelize from 'Sequelize';

export default sequelize.define('GOODS', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  /* name: {
    type: Sequelize.STRING,
    comment: '品名',
  },
  buy_price: {
    type: Sequelize.FLOAT,
    comment: '标准进价',
  },
  sell_price: {
    type: Sequelize.FLOAT,
    comment: '标准售价',
  },
  total: {
    type: Sequelize.INTEGER,
    comment: '数量',
  },
  remark: {
    type: Sequelize.STRING,
    comment: '备注',
  },*/
}, {
  comment: '物品', // 注释
  underscored: true, // 默认属性下划线
  freezeTableName: true, // 表名不复数
  timestamps: true, // 记录时间
  paranoid: false, // 逻辑删除
  version: false, // 数据版本
  charset: 'utf8mb4',
  dialectOptions: {
    collate: 'utf8mb4_general_ci',
  },
});
