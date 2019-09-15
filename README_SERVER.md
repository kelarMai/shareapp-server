# shareapp-server

use:
  1. npn install
  2. npm run app  启动单个实例
  3. pm2 start ./bin/app.js 集群模式启动单个实例
  4. pm2 start ecosystem.config.js 使用文件启动

used module:
  1. express
  2. log4js

other tools:
  1. 使用 nvm 管理 node 和 npm 版本
  2. pm2 用来开启多个进程
	https://www.npmjs.com/package/pm2
	https://pm2.io/doc/en/runtime/overview/
  3. pm2-intercom
	https://log4js-node.github.io/log4js-node/clustering.html
  4. mongodb 做缓存 v4.0.9
  5. mysql 做数据持久化 Ver 14.14 Distrib 5.7.25,
  		需根据 app.json 文件，提前创建用户，限制用户权限和数据库
  6. 还是得需要添加 rpc 框架



log4js:
  "info": 收到和发送的信息；
  "debug_file": 查看运行情况的信息；
  "debug_console": 普通 debug 的信息，输出到标准输出，方便查看；