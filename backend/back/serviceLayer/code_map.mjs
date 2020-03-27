"use strict";

import {
    getPointImportant,
    registerMessage,
    registerPointImportant,
    updatePointImportant,
    deletePointImportant,
    getTrajet,
    rechercherTrajet1,
    rechercherEscale,
    enregistrerTrajet,
    updateTrajet,
    deleteTrajet
} from '../dataAccessLayer/requete_map.mjs';

import {
    distance,
    addressToCoordinate
} from './distance.mjs';



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

export async function codeRechercherTrajet(adresse_depart_user, adresse_arrive_user) {

    // * result = trajet chauffeur
    const result = await rechercherTrajet1(adresse_depart_user, adresse_arrive_user);

        if(result.length === 0) {

            // * s'il n'y a pas de trajet dans résult, chercher des trajets qui ont pour escale adresse_arrive_user
            // * s'occupe aussi d'ajouter les coordonnées des adresses du voyageur et du chauffeur au résultat
            return codeRechercherEscale(adresse_depart_user, adresse_arrive_user);

        } else {
    
            // * ajouter les coordonnées des adresses du voyageur et du chauffeur au résultat
            for(let i = 0, n = result.length; i < n; i++) {
                result[i].coords_depart_user = await addressToCoordinate(adresse_depart_user);
                result[i].coords_arrive_user =  await addressToCoordinate(adresse_arrive_user);
                result[i].coords_depart_chauffeur = await addressToCoordinate(result[i].adresse_depart);
                result[i].coords_arrive_chauffeur = await addressToCoordinate(result[i].adresse_arrive);
            }

            return result;
        }

}


async function codeRechercherEscale(adresse_depart_user, adresse_arrive_user) {

    let tableau = [];

    const result = await rechercherEscale();    // * result = trajet du chauffeur

    for(let i = 0, n = result.length; i < n; i++) {

        let trajet = result[i];
        let escale = trajet.escale;
        let depart_chauffeur = trajet.adresse_depart;
        let arrive_chauffeur = escale; 
        // * arrive = escale car on ne veut afficher au front que le départ et l'escale, l'arrive du chauffeur ne regarde pas le voyageur
        let isDist = await distance(adresse_depart_user, adresse_arrive_user, depart_chauffeur, arrive_chauffeur);

        console.log('\nDépart : ' + trajet.adresse_depart + ', arrivé : ' + trajet.adresse_arrive + ', escale : ' +  trajet.escale);
        console.log('is dist : ' + isDist.bool);
        
        // * ajoute les coordonnées du voyageur et chauffeur si la condition est respectée
        if (escale === adresse_arrive_user && isDist.bool === true){

            trajet.coords_depart_user = isDist.depart_user;
            trajet.coords_arrive_user = isDist.arrive_user;
            trajet.coords_depart_chauffeur = isDist.depart_chauffeur;
            trajet.coords_arrive_chauffeur = isDist.arrive_chauffeur;

            tableau.push(trajet);
        }          
    }

    return tableau;

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