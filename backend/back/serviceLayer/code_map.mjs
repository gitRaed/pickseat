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
    registerDemande,
    getDemandeChauffeur,
    getDemandeVoyageur,
    getDemande,
    updateDemandeStatus,
    notificationChauffeur,
    notificationVoyageur
} from '../dataAccessLayer/requete_map.mjs';

import {
    authDbEmail
} from '../dataAccessLayer/requete_data.mjs';

import {
    distance,
    distanceForAlarm,
    addressToCoordinate
} from './service/distance.mjs';

import {
    compareTrajet,
    compareDemande
} from './service/compareDate.mjs';


// * enregistrer message de contactUs du front
export async function codeRegisterMessage(email, message) {

    try {
        
        return registerMessage(email, message);

    } catch (error) {

        console.log('Code register message : ' + error);
    }
}

//#region pointImportant

export async function codeGetPointImportant(email) {

    try {
        
        const result = await getPointImportant(email);

        const data = [];
    
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

    } catch (error) {

        console.log('Code get point important error : ' + error);
    }
}


export function codePointImportant(email, message, latitude, longitude, sonner) {

    try {
        
        return registerPointImportant(email, message, latitude, longitude, sonner);

    } catch (error) {

        console.log('code point important error ' + error);   
    }
}


export function codeUpdatePointImportant(id, message, sonner) {

    try {

        return updatePointImportant(id, message, sonner);

    } catch (error) {

        console.log('code update point important error : ' + error);
    }
}


export function codeDeletePointImportant(id) {

    try {

        return deletePointImportant(id);

    } catch (error) {

        console.log('code delete point important erro : ' + error);
    }
}


export async function codeAlarme(email, latitude_user, longitude_user) {

    try {
        
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

    } catch (error) {
        
        console.log('code alarem : ' + error);
    }
}
//#endregion


//#region trajet

export async function codeGetTrajet(email) {

    try {
        
        const val = await compareTrajet(email); // * 'supprime' les vieux trajets
    
        const trajet = await getTrajet(email); // * retourne la liste des trajets de l'utilisateur filtrée, anciennes dates supprimées
    
        if (val === true) {
    
            return trajet;
        }

    } catch (error) {
        
        console.log('code get trajet error : ' + error);
    }
}


export async function codeRechercherTrajet(email, adresse_depart_user, adresse_arrive_user) {

    try {
        
        await compareTrajet(email); // * 'supprime' les vieux trajets

        const trajet = [];
    
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
                    
                    // * si le trajet n'est pas périmé
                    if (result[i].validite === 0) {
    
                        result[i].coords_depart_user = await addressToCoordinate(adresse_depart_user);
                        result[i].coords_arrive_user =  await addressToCoordinate(adresse_arrive_user);
                        result[i].coords_depart_chauffeur = await addressToCoordinate(result[i].adresse_depart);
                        result[i].coords_arrive_chauffeur = await addressToCoordinate(result[i].adresse_arrive);
                        result[i].tarif = result[i].tarif_total;
                        trajet.push(result[i]);
                    }
                }
    
                return trajet;
            }

    } catch (error) {
        
        console.log('code rechercehr trajet error : ' + error);
    }
}


async function codeRechercherEscale(adresse_depart_user, adresse_arrive_user) {

    try {

        let tableau = [];

        const result = await rechercherEscale();    // * result = trajet du chauffeur

        for(let i = 0, n = result.length; i < n; i++) {

            let trajet = result[i];
            let escale = trajet.escale;
            let depart_chauffeur = trajet.adresse_depart;
            let arrive_chauffeur = escale; 
            // * arrive = escale car on ne veut afficher au front que le départ et l'escale, l'arrive du chauffeur ne regarde pas le voyageur
            let isDist = await distance(adresse_depart_user, adresse_arrive_user, depart_chauffeur, arrive_chauffeur);

            const escaleTr = escale.toLowerCase().split(' ');
            const arriver_userTr = adresse_arrive_user.toLowerCase().split(' ');

            const verif = await verifierEscaleEtArrive(escaleTr, arriver_userTr);

            // * ajoute les coordonnées du voyageur et chauffeur si les conditions sont respectées
            if (verif === true && isDist.bool === true && trajet.validite === 0){

                trajet.coords_depart_user = isDist.depart_user;
                trajet.coords_arrive_user = isDist.arrive_user;
                trajet.coords_depart_chauffeur = isDist.depart_chauffeur;
                trajet.coords_arrive_chauffeur = isDist.arrive_chauffeur;
                trajet.tarif = trajet.tarif_escale;

                tableau.push(trajet);
            }          
        }

        return tableau;

    } catch (error) {
        
        console.log('code rechercher escale error : ' + error);
    }
}

async function verifierEscaleEtArrive(escale, arriver_user) {

    // * Cette fonction vérifie si l'escale du chauffeur correspond à celui du voyageur

    // * Pourquoi faire une fonction juste pour sa? ben imagine si pour chercher 'solibra' le mec tape sa : Société de Limonaderies et Brasseries d'Afrique Solibra, Rue des Brasseurs, Arras, Zone 3, Treichville, Abidjan, 26, Côte d'Ivoire
    // * même si le chauffeur a une escale a solibra, l'algorithme ne vas pas encoyer au voyageur le chauffeur en question
    // * donc on fait un check pour voir si ya un mot dans l'adresse du voyageur qui correspond à l'escale du chauffeur

    
    try {

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

    } catch (error) {
        
        console.log('code verifier escale et arrive error : ' + error);
    }
    
}


export function codeEnregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {

    try {

        return enregistrerTrajet(nom_chauffeur, prenom_chauffeur, email_chauffeur, numero_chauffeur, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale);

    } catch (error) {

        console.log('code enregistrer trajet error : ' + error);
    }
}


export function codeUpdateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {

    try {

        return updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale);

    } catch (error) {

        console.log('code update trajet error : ' + error);
    }
}


//#endregion


//#region demandes

export async function codeRegisterDemande(email_chauffeur, email_voyageur, adresse_depart, adresse_arrive, date_trajet, heure_trajet, tarif) {

    try {

        const chauffeurData = await authDbEmail(email_chauffeur);
        const voyageurData = await authDbEmail(email_voyageur);

        const requete = await registerDemande(chauffeurData[0].nom, chauffeurData[0].prenom, chauffeurData[0].numero, email_chauffeur,
                                                voyageurData[0].nom, voyageurData[0].prenom, voyageurData[0].numero, email_voyageur,
                                                adresse_depart, adresse_arrive, date_trajet, heure_trajet, tarif);

        return requete;

    } catch (error) {
        console.log('Code register demande error : ' + error);
    }
}

export async function codeGetDemandeUser(email, type) {

    try {

        await codeGetDemande(); // * 'supprime' les vieilles demandes

        if(type === 'chauffeur') {

            const demandeChauffeur = await getDemandeChauffeur(email);

            return demandeChauffeur;

        } else if (type === 'voyageur') {

            const demandeVoyageur = await getDemandeVoyageur(email);

            return demandeVoyageur;
        }
    } catch (error) {
        
        console.log('code get demande user error : ' + error);
    }
}

export async function codeGetDemande() {

    try {

        await compareDemande(); // * 'supprime' les vieilles demandes

        const listeDemande = await getDemande();
    
        if (listeDemande.length === 0 ) {
    
            return 'Pas de demandes';
    
        } else {
    
            return listeDemande;
        }

    } catch (error) {

        console.log('code get demande error : ' + error);
    }
}

export async function codeUpdateDemandeStatus(id, status) {

    try {

        let message = 'Vous devez accepter ou refuser la demande et rien d\'autre! ';
        
        if (status === 'accepter' || status === 'refuser') {

            await updateDemandeStatus(id, status);
        }

        if (status === 'accepter') {

            message = 'Demande acceptée ';

        } else if (status === 'refuser') {

            message = 'Demande refusée ';
        }
        
        return message;

    } catch (error) {
        
        console.log('code update demande status error : ' + error);
    }
}

//#endregion


//#region notifications

export async function codeNotification(email, typeUser) {

    try {

        if(typeUser === 'chauffeur') {

            let test = await notificationChauffeur(email); 
            if (test <= 1) {
    
                test = 0;
            }
    
            return test;
            //* retourne le nombre de demandes du chauffeur avec un status 'attente'
    
        } else if (typeUser === 'voyageur') {
    
            return await notificationVoyageur(email);
            //* retourne le nombre de demandes du voyageur avec un status 'accepter'
        }   

    } catch (error) {

        console.log('code notification error : ' + error);
    }
}
//#endregion


