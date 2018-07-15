import sequelize from '../db';
import Sequelize from 'Sequelize';
// import Goods from './goods';

export default sequelize.define('GOODS_DETAIL_LIST', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  /* goods_id: {
    type: Sequelize.STRING,
    comment: '物品id',
    references: {
      model: Goods,
      key: 'id',
    },
  },
  count: {
    type: Sequelize.FLOAT,
    comment: '计数（正加负减）',
  },
  remark: {
    type: Sequelize.STRING,
    comment: '备注',
  },*/
}, {
  comment: '进出明细', // 注释
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
