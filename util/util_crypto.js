
const crypto = require('crypto');

class Crypto {

    constructor(){
        const iv = crypto.createHash('sha256').update('kelar').digest();
        this.resizedIV = Buffer.alloc(16);
        iv.copy(resizedIV);

        this.cipheriv = this.cipheriv.bind(this);
        this.decipherIV = this.decipherIV.bind(this);
    }

    async hashCrypto(message){
        return await crypto.createHash('sha256').update(message).digest('hex');
    }

    async halfOfHashCrypto(message){
        var hash_code =  await hashCrypto(message);
        return hash_code.substr(0,32);
    }

    async hmacCrypto(message,key){
        return await crypto.createHmac('sha256',key).update(message).digest('hex');
    }

    async halfOfHmacCrypto(message,key){
        var hmac_code = await hmacCrypto(message,key);
        return hmac_code.substr(0,32);
    }

    async cipherIV(message,key){
        const new_key = crypto.createHash('sha256').update(key).digest(),
            cipherIV = crypto.createCipheriv('aes256',new_key,this.resizedIV);
        var crypted = cipherIV.update(message,'utf8','hex');
        crypted += cipherIV.final('hex');
        return crypted;
    }

    async decipherIV(crypted,key){
        const new_key = crypto.createHash('sha256').update(key).digest(),
            decipherIV = crypto.createDecipheriv('aes256',new_key,this.resizedIV);
        var decrypted = decipherIV.update(crypted,'hex','utf8');
        decrypted += decipherIV.final('utf8');
        return decrypted;
    }
}