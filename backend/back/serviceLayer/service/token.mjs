import * as JWT from 'jsonwebtoken';


export function createAccessToken() {

    return JWT.sign({}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '60m',
    });
}


