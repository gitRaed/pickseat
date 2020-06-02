"use strict";
import { isAuth } from '../../serviceLayer/service/isAuth.mjs';
import { authCodeEmail } from '../../serviceLayer/code_data.mjs';

export async function verif(token, email) {

    try {
        
        const verifToken = await isAuth(token);
        const verifEmail = await authCodeEmail(email);

        const result = {
            bool: false,
            message : ''
        };

        if (verifToken.message !== '') {

            result.message = verifToken.message;
        } 
        
        if (verifEmail.auth === false) {

            result.message += 'L\'utilisateur n\'existe pas';
        } 

        return result.message;

    } catch (error) {
        console.log('Service verif error : ' + error);
        return error;
    }
}