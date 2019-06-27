
const rpc_request = require('../../models/http_request/rpc');

class Verification{
    
    async getCode(req,res,next){
        const phone_number = req.params.phone_number;
        let options = {
            hostname:'192.168.1.1',
            port:80,
            path:'/verification',
            method:'get'
        };
        let verifiication_code = rpc_request(options,true);
        if (verifiication_code == null){
            
        }

    }
}