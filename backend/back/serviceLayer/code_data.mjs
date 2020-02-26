"use strict";

import {
    getUserData,
    updateDbUser,
    deleteDbUser,
    authDbEmail,
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

export function updateUser(id, nom, prenom, email, numero, typeUser) {


    return updateDbUser(id, nom, prenom, email, numero, typeUser);
}

export function deleteUser(id) {

    return deleteDbUser(id);
}

export function authCode(email, motDePasse) {

    let data = {
        auth : false,
        nom: '',
        prenom: ''
    };

    // check la disponibilité du mdp, ensuite le mail et renvoyer un objet
    return getUserData().then( (result) => {

        for (let i = 0, n  = result.length; i < n && !data.auth; i++) {

            result[i].motDePasse = decrypt(result[i].motDePasse);

            if(result[i].email === email || result[i].motDePasse === motDePasse) {
                data.auth = true;
                data.nom = result[i].nom;
                data.prenom = result[i].prenom;
            }
                
        }
        return data;
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