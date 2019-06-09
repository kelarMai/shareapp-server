
const {promisify} = require('util');
const redis = require('redis');

class Redis{
    constructor(config){
        this.client = redis.createClient(config.port,config.ip);
        
        this.client.on('ready',()=>{
            debugf('redis connect succeefully to ',config.port,config.ip);
        });

        this.client.on('end',()=>{
            debugf("redis connect end;");
        });

        this.client.on('error',(err) => {
            debugf('redis constructor error: ',err);
        });
        
        this.getAsync = promisify(this.client.get).bind(client);
        this.setAsync = promisify(this.client.set).bind(client);
    }
}

module.exports = Redis;