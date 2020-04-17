"use strict";

import {
    getUserData,
    updateDbUser,
    deleteDbUser,
    authDbEmail,
    statusDb
} from '../dataAccessLayer/requete_data.mjs';

import {
    decrypt,
    encrypt
} from './service/crypter.mjs';

import {
    admin,
    superAdmin
} from './service/isAdmin.mjs';


export async function getUser(email) {

    const table = [];
    const result = await getUserData(); // * toutes les données de tout les utilisateurs
    const isAdmin = await admin(email);
    const isSuperAdmin = await superAdmin(email);

    for(let i = 0, n = result.length; i < n; i++) {

        const current_user_email = result[i].email;
        const isCurrentAdmin = await admin(current_user_email);
        const isCurrentSuper = await superAdmin(current_user_email);

        result[i].motDePasse = 'null';

        if (isAdmin === true && (isCurrentAdmin !== true && isCurrentSuper !== true)) {

            table.push(result[i]);

        } else if (isSuperAdmin === true && isCurrentSuper !== true) {

            if (isCurrentAdmin === true) {

                result[i].typeUser += " et admin";
                // * pour signaler au super admin que l'utilisateur en question est un admin
            }

            table.push(result[i]);
        }

    }

    return table;
}

export function updateUser(id, nom, prenom, email, numero, typeUser) {


    return updateDbUser(id, nom, prenom, email, numero, typeUser);
}

export function deleteUser(id) {

    return deleteDbUser(id);
}

export async function authCode(email, motDePasse) {

    let data = {
        auth : false,
    };

    // check le mot de passe et l'email
    const result =  await getUserData();

    for (let i = 0, n  = result.length; i < n && !data.auth; i++) {

        const mdp = decrypt(result[i].motDePasse);
        const emailDB = result[i].email;

        if(emailDB === email && mdp === motDePasse) {

            const isAdmin = await admin(email);
            const isSuperAdmin = await superAdmin(email);

            data.auth = true;
            data.id = result[i].id_utilisateur;
            data.nom = result[i].nom;
            data.prenom = result[i].prenom;
            data.email = result[i].email;
            data.numero = result[i].numero;
            data.typeUser = result[i].typeUser;
            data.statusValidation = result[i].status_validation;
            data.statusCompte = result[i].status_compte;
            data.admin = false;
            data.superAdmin = false;

            if (isAdmin === true){
                data.admin = true;
            }

            if (isSuperAdmin === true){
                data.admin = true;
                data.superAdmin = true;
            }
            
        }
            
    }


    return data;
}

export async function authCodeEmail(email) {

    let data = {
        auth: false
    };

    const verif = await authDbEmail(email);

    for(let i = 0, n = verif.length; i < n; i++){

        if (verif[i].email === email) {
            data.auth = true;
        }
    }

    return data;

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