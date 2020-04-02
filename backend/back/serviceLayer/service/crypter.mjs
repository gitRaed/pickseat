import * as Crypto from "crypto";


let algorithm = 'aes-256-cbc';
export let password = 'd6F3Efeq';


export function encrypt(text) {

    let cipher = Crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

export function decrypt(text) {
    var decipher = Crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}