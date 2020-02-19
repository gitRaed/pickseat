"use strict";
import {
    registerUser
} from "../dataAccessLayer/requete_register.mjs";
import {
    encrypt
} from './crypter.mjs';

export async function recupererData(nom, prenom, email, numero, typeUser, motDePasse) {


    motDePasse = encrypt(motDePasse);
    // console.log(nom, prenom, email, numero, typeUser, motDePasse);
    return registerUser(nom, prenom, email, numero, typeUser, motDePasse);

}