"use strict";

import {
    getPointImportant,
    registerMessage,
    registerPointImportant,
    updatePointImportant,
    deletePointImportant,
    getTrajet,
    rechercherTrajet1,
    enregistrerTrajet,
    updateTrajet,
    deleteTrajet
} from '../dataAccessLayer/requete_map.mjs';



export async function codeRegisterMessage(email, message) {

    return registerMessage(email, message);
}

//#region pointImportant
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

export async function codePointImportant(email, message, latitude, longitude) {

    return registerPointImportant(email, message, latitude, longitude);
}

export async function codeUpdatePointImportant(id, message) {

    return updatePointImportant(id, message);
}

export async function codeDeletePointImportant(id) {

    return deletePointImportant(id);
}
//#endregion

//#region trajet
export async function codeGetTrajet(email) {

    return getTrajet(email);
}

export async function codeRechercherTrajet(adresse_depart, adresse_arrive, heure_trajet, date_trajet) {

    return rechercherTrajet1(adresse_depart, adresse_arrive).then( (result) => {

        if(result.length === 0) {
            return 'Pas de trajet similaire avec ses données';
        } else {
            return result;
        }
    });
}

export async function codeEnregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {

    return enregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale);
}

export async function codeUpdateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {

    return updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale);
}

export async function codeDeleteTrajet(id) {

    return deleteTrajet(id);
}
//#endregion