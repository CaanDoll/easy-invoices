import fse from 'fs-extra';
import path from 'path';
import os from 'os';
import Sequelize from 'sequelize';

// 将数据存至系统用户目录，防止用户误删程序
export const docDir = path.join(os.homedir(), 'easy-invoices');
export const dbPath = path.join(docDir, 'data.sqlite3');
fse.ensureFileSync(dbPath);

const sequelize = new Sequelize('sqlite:' + dbPath);

export default sequelize;
