"use strict";

import {
    registerUser,
    registerFinal,
    resetPasswordDb
} from "../dataAccessLayer/requete_register.mjs";

import { encrypt } from './service/crypter.mjs';



export function registerData(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse) {


    motDePasse = encrypt(motDePasse);
    
    return registerUser(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse);

}

export function registerFinalCode(email, status_validation, status_compte) {

    return registerFinal(email, status_validation, status_compte);
}

export function resetPasswordcode(email, motDePasse) {

    motDePasse = encrypt(motDePasse);
    return resetPasswordDb(email, motDePasse);
}