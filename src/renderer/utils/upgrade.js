import settings from './settings';
import packageJson from '../../../package.json';
// 程序当前版本
const appCurrentVersion = packageJson.version;

/*
import db from './db';

// 罗列增量升级脚本
const incrementalUpgrade = {
  '1.0.1':()=>{
    db.run();
  },
  '1.0.2':()=>{
    db.run();
  },
}

// 升级前版本
const beforeUpgradeVersion = settings.get('version');
// 寻找执行的脚本 增量执行
*/

// 升级完成
settings.set('version', appCurrentVersion);
