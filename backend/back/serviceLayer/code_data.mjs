"use strict";

import {
    getUserData, updateDbUser, deleteDbUser
} from '../dataAccessLayer/requete_data.mjs';
import { encrypt } from './crypter.mjs';


export function getUser() {

    return getUserData().then( (data) => {

        return data;
    });

}

export function updateUser(id, nom, prenom, email, numero, typeUser, motDePasse) {

    motDePasse = encrypt(motDePasse);

    return updateDbUser(id, nom, prenom, email, numero, typeUser, motDePasse);
}

export function deleteUser(id) {
 
    return deleteDbUser(id);
}