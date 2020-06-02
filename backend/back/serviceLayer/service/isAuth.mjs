import * as JWT from 'jsonwebtoken';

export function isAuth(authorization) {

    const data = {
        token : '',
        userID: '',
        message : ''
    };


    if(authorization === undefined) {

        data.message = 'You need to login';

    } else  {

        data.token = authorization.split(' ')[1];
        data.userID = JWT.verify(data.token, process.env.ACCESS_TOKEN_SECRET);
    }


    return data;
}
