"use strict";
import {
    registerUser,
    registerFinal
} from "../dataAccessLayer/requete_register.mjs";
import {
    encrypt
} from './crypter.mjs';

export async function registerData(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse) {


    motDePasse = encrypt(motDePasse);
    // console.log(nom, prenom, email, numero, typeUser, motDePasse);
    return registerUser(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse);

}

export async function registerFinalCode(email, status_validation, status_compte) {

    return registerFinal(email, status_validation, status_compte);
}