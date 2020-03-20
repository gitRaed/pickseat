"use strict";

import {
    getPointImportant,
    registerMessage,
    registerPointImportant,
    updatePointImportant,
    deletePointImportant,
    getTrajet,
    enregistrerTrajet,
    updateTrajet,
    deleteTrajet
} from '../dataAccessLayer/requete_map.mjs';


export async function codeGetPointImportant(email) {

    return getPointImportant(email).then( (result) => {

        let data = [];

        for(let i = 0, n = result.length; i < n; i++) {

            data.push({
                id_points : result[i].id_points,
                message : result[i].message,
                latitude : result[i].latitude,
                longitude : result[i].longitude 
            });
        }

        return data;
    });
}


export async function codeRegisterMessage(email, message) {

    return registerMessage(email, message);
}

export async function codePointImportant(email, message, latitude, longitude) {

    return registerPointImportant(email, message, latitude, longitude);
}

export async function codeUpdatePointImportant(id, message) {

    return updatePointImportant(id, message);
}

export async function codeDeletePointImportant(id) {

    return deletePointImportant(id);
}

export async function codeGetTrajet(email) {

    return getTrajet(email);
}

export async function codeEnregistrerTrajet(email, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {

    return enregistrerTrajet(email, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale);
}

export async function codeUpdateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {

    return updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale);
}

export async function codeDeleteTrajet(id) {

    return deleteTrajet(id);
}