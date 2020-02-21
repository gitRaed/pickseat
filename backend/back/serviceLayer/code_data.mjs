"use strict";

import {
    getUserData,
    updateDbUser,
    deleteDbUser,
    authDb,
    statusDb
} from '../dataAccessLayer/requete_data.mjs';
import {
    encrypt,
    decrypt
} from './crypter.mjs';


export function getUser() {

    return getUserData().then((result) => {
        
        for(let i = 0, n = result.length; i < n; i++) {
            result[i].motDePasse = 'null';
        }
        return result;
    });
}

export function updateUser(id, nom, prenom, email, numero, typeUser, motDePasse) {

    motDePasse = encrypt(motDePasse);

    return updateDbUser(id, nom, prenom, email, numero, typeUser, motDePasse);
}

export function deleteUser(id) {

    return deleteDbUser(id);
}

export function authCode(email, motDePasse) {

    let statusAuth = '';

    return authDb(email).then( (result) => {

        console.log('T passé par la ');
        for(let i = 0, n = result.length; i < n; i++) {

            result[i].motDePasse = decrypt(result[i].motDePasse);
            if(result[i].motDePasse === motDePasse)
                statusAuth = {statusAuth : false};
            else 
                statusAuth = {statusAuth: true};
            
        }
        
        return statusAuth;
    });

}

export function banCode(id) {

    let status_compte = "Banni";

    return statusDb(id, status_compte);
}

export function suspendCode(id) {

    let status_compte = "Suspendu";

    return statusDb(id, status_compte);
}

export function normalCode(id) {

    let status_compte = "Actif";

    return statusDb(id, status_compte);
}