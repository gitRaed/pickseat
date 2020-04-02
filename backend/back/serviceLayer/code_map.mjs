"use strict";

import {
    getPointImportant,
    registerMessage,
    registerPointImportant,
    updatePointImportant,
    deletePointImportant,
    alarme,
    getTrajet,
    rechercherTrajet1,
    rechercherEscale,
    enregistrerTrajet,
    updateTrajet,
    deleteTrajet
} from '../dataAccessLayer/requete_map.mjs';

import {
    distance,
    distanceForAlarm,
    addressToCoordinate
} from './service/distance.mjs';


// * enregistrer message de contactUs du front
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
                longitude : result[i].longitude,
                sonner : result[i].sonner 
            });
        }

        return data;
    });
}


export async function codePointImportant(email, message, latitude, longitude, sonner) {

    return registerPointImportant(email, message, latitude, longitude, sonner);
}


export async function codeUpdatePointImportant(id, message, sonner) {

    return updatePointImportant(id, message, sonner);
}


export async function codeDeletePointImportant(id) {

    return deletePointImportant(id);
}


export async function codeAlarme(email, latitude_user, longitude_user) {

    const resultatAlarme = await alarme(email);
    let bool = false;
    let libelle = '';

    const coords_user = {
        lat : latitude_user,
        lng : longitude_user
    };

    for (let i = 0, n = resultatAlarme.length; i < n; i++) {

        let coords_point = {
            lat : resultatAlarme[i].latitude,
            lng: resultatAlarme[i].longitude
        };

        let isDist = await distanceForAlarm(coords_user, coords_point);

        if (isDist === true) {
            bool = true;
            libelle = resultatAlarme[i].message;
            console.log('Faire sonner le téléphone');
        }

    }

    return {
        isDist : bool,
        libelle : libelle
    };
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
            // * cas où le chauffeur et le voyageur ont le même trajet
            // * ajouter les coordonnées des adresses du voyageur et du chauffeur au résultat
            for(let i = 0, n = result.length; i < n; i++) {
                result[i].coords_depart_user = await addressToCoordinate(adresse_depart_user);
                result[i].coords_arrive_user =  await addressToCoordinate(adresse_arrive_user);
                result[i].coords_depart_chauffeur = await addressToCoordinate(result[i].adresse_depart);
                result[i].coords_arrive_chauffeur = await addressToCoordinate(result[i].adresse_arrive);
                result[i].tarif = result[i].tarif_total;
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

        const escaleTr = escale.toLowerCase().split(' ');
        const arriver_userTr = adresse_arrive_user.toLowerCase().split(' ');

        const verif = await verifierEscaleEtArrive(escaleTr, arriver_userTr);

        // * ajoute les coordonnées du voyageur et chauffeur si la condition est respectée
        if (verif === true && isDist.bool === true){

            trajet.coords_depart_user = isDist.depart_user;
            trajet.coords_arrive_user = isDist.arrive_user;
            trajet.coords_depart_chauffeur = isDist.depart_chauffeur;
            trajet.coords_arrive_chauffeur = isDist.arrive_chauffeur;
            trajet.tarif = trajet.tarif_escale;

            tableau.push(trajet);
        }          
    }

    return tableau;

}

async function verifierEscaleEtArrive(escale, arriver_user) {

    // * Cette fonction vérifier si l'escale du chauffeur correspond à celui du voyageur

    // * Pourquoi faire une fonction juste pour sa? ben imagine si pour chercher 'solibra' le mec tape sa : Société de Limonaderies et Brasseries d'Afrique Solibra, Rue des Brasseurs, Arras, Zone 3, Treichville, Abidjan, 26, Côte d'Ivoire
    // * même si le chauffeur a une escale a solibra, l'algorithme ne vas pas encoyer au voyageur le chauffeur en question
    // * donc on fait un check pour voir si ya un mot dans l'adresse du voyageur qui correspond à l'escale du chauffeur

    // ! cette fonction ne marche pas avec la ponctuation, pour que l'exemple dans haut marche, faut retirer les virgules
    for(let j = 0, m = escale.length; j < m ; j++) {

        for(let k = 0, o = arriver_user.length; k < o; k++) {

            console.log(escale[j], arriver_user[k]);
            if (escale[j] === arriver_user[k]){
                console.log('True');
                return true;
            }                
        }
    }
    
}


export async function codeEnregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {

    return enregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale);
}


export async function codeUpdateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {

    return updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale);
}


export async function codeDeleteTrajet(id) {

    return deleteTrajet(id);
}
//#endregion


