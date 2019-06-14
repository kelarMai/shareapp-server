
const crypto = require('crypto');

class Crypto {

    constructor(){
        const iv = crypto.createHash('sha256').update('kelar-shareapp').digest();
        this.resizedIV = Buffer.alloc(16);
        iv.copy(this.resizedIV);

        this.cipherIV = this.cipherIV.bind(this);
        this.decipherIV = this.decipherIV.bind(this);
        this.halfOfHashCrypto = this.halfOfHashCrypto.bind(this);
        this.halfOfHmacCrypto = this.halfOfHmacCrypto.bind(this);
    }

    hashCrypto(message){
        return crypto.createHash('sha256').update(message).digest('hex');
    }

    halfOfHashCrypto(message){
        let hash_code = this.hashCrypto(message);
        return hash_code.substr(0,32);
    }

    hmacCrypto(message,key){
        return crypto.createHmac('sha256',key).update(message).digest('hex');
    }

    halfOfHmacCrypto(message,key){
        let hmac_code = this.hmacCrypto(message,key);
        return hmac_code.substr(0,32);
    }

    cipherIV(message,key){
        const new_key = crypto.createHash('sha256').update(key).digest(),
            cipherIV = crypto.createCipheriv('aes256',new_key,this.resizedIV);
        let crypted = cipherIV.update(message,'utf8','hex');
        crypted += cipherIV.final('hex');
        return crypted;
    }

    decipherIV(crypted,key){
        const new_key = crypto.createHash('sha256').update(key).digest(),
            decipherIV = crypto.createDecipheriv('aes256',new_key,this.resizedIV);
        let decrypted = decipherIV.update(crypted,'hex','utf8');
        decrypted += decipherIV.final('utf8');
        return decrypted;
    }
}
