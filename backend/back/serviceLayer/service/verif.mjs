"use strict";
import {
    isAuth
} from '../../serviceLayer/service/isAuth.mjs';
import {
    authCodeEmail
} from '../../serviceLayer/code_data.mjs';

export async function verif(token, email, response) {

    try {
        
        const verifToken = await isAuth(token);
        const verifEmail = await authCodeEmail(email);

        const result = {
            bool : true,
            message : ''
        };

        if (verifToken.message !== '') {

            result.message = verifToken.message;
            result.bool = false;
        } 
        
        if (verifEmail.auth === false) {

            result.message = 'L\'utilisateur n\'existe pas';
            result.bool = false;
        } 

        return result;

    } catch (error) {
        console.log('Service verif error : ' + error);
    }
}