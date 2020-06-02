"use strict";
import sql from 'mssql';

var config = {
    user: 'sa',
    password: 'raed',
    server: 'localhost',
    database: 'pickseat',
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    },
};

// * enregitre le message de contactUs du front
export async function registerMessage(email, message) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('email', email)
            .input('message', message)
            .query('INSERT INTO contactUs VALUES (@email, @message)');
            return 'Message enregistrée!';

    } catch (error) {

        console.log('Register Message, erreur : ' + error);
        return 'Register message erreur,' + error;
    }
}


//#region point important 

export async function getPointImportant(email) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('email', email)
                        .query('SELECT * FROM pointImportant WHERE email_user=@email');
        return result.recordset;

    } catch (error) {

        console.log('Requete_map, get point important error : ' + error);
        return error;
    }
}

export async function registerPointImportant(email, message, latitude, longitude, sonner) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('email', email)
            .input('message', message)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .input('sonner', sonner)
            .query('INSERT INTO pointImportant VALUES (@email, @message, @latitude, @longitude, @sonner)');
            return 'Point important enregistré!';

    } catch (error) {

        console.log('Register point important error : ' + error);
        return 'Register point important error : ' + error;
    }
}

export async function updatePointImportant(id, message, sonner) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                .input('id', id)
                .input('message', message)
                .input('sonner', sonner)
                .query('UPDATE pointImportant SET message=@message, sonner=@sonner WHERE id_points=@id');
        return 'Point modifié!';

    } catch (error) {

        console.log("update point important error : " + error);
        return error;
    }
}

export async function deletePointImportant(id) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('id', id)
            .query('DELETE pointImportant WHERE id_points=@id');
        return 'Point supprimé!';

    } catch (error) {

        console.log('Delete point important error : ' + error);
        return error;
    }
}

export async function alarme(email) {

    try {

        const sonner = 'oui';
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('email', email)
                        .input('sonner', sonner)
                        .query('SELECT message, latitude, longitude FROM pointImportant WHERE email_user=@email and sonner=@sonner');
        return result.recordset;

    } catch (error) {

        console.log('Requête alarme error : ' + error);
        return error;
    }
}

//#endregion


//#region trajet

export async function getTrajet(email) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('email', email)
                        .query('SELECT * FROM trajet WHERE email_chauffeur=@email ORDER BY date_trajet DESC');
        return result.recordset;

    } catch (error) {

        console.log('Requête getTrajet error : ' + error);
        return error;
    }
}

export async function rechercherTrajet1(adresse_depart, adresse_arrive) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('adresse_depart', adresse_depart)
                        .input('adresse_arrive', adresse_arrive)
                        .query('SELECT * FROM trajet WHERE adresse_depart=@adresse_depart and adresse_arrive=@adresse_arrive ORDER BY date_trajet');
        return result.recordset;

    } catch (error) {

        console.log('Rerchercher trajet error : ' + error);
        return error;
    }
}

export async function rechercherEscale() {

    try {

        const options = 'oui';
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                    .input('options', options)
                                    .query('SELECT * FROM trajet WHERE options=@options');
        return result.recordset;

    } catch (error) {

        console.log('Requête rechercher escale error : ' + error);
        return error;
    }
}

export async function enregistrerTrajet(nom_chauffeur, prenom_chauffeur, email, numero, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {
    
    try {
        
        const validite = 0;
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('nom', nom_chauffeur)
                    .input('prenom', prenom_chauffeur)
                    .input('email', email)
                    .input('numero', numero)
                    .input('adresse_depart', adresse_depart)
                    .input('adresse_arrive', adresse_arrive)
                    .input('heure_trajet', heure_trajet)
                    .input('date_trajet', date_trajet)
                    .input('options', options)
                    .input('escale', escale)
                    .input('tarif_total', tarif_total)
                    .input('tarif_escale', tarif_escale)
                    .input('validite', validite)
                .query('INSERT INTO trajet VALUES (@nom, @prenom, @email, @numero, @adresse_depart, @adresse_arrive, @heure_trajet, @date_trajet, @options, @escale, @tarif_total, @tarif_escale, @validite)');

        return 'Trajet enregistré !';

    } catch (error) {

        console.log('Requête enregistrer trajet error : ' + error);
        return error;
    }
}

export async function updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale, tarif_total, tarif_escale) {
    
    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('id', id)
                    .input('adresse_depart', adresse_depart)
                    .input('adresse_arrive', adresse_arrive)
                    .input('heure_trajet', heure_trajet)
                    .input('date_trajet', date_trajet)
                    .input('options', options)
                    .input('escale', escale)
                    .input('tarif_total', tarif_total)
                    .input('tarif_escale', tarif_escale)
                .query('UPDATE trajet SET adresse_depart = @adresse_depart, adresse_arrive = @adresse_arrive, heure_trajet = @heure_trajet, date_trajet = @date_trajet, options = @options, escale = @escale, tarif_total = @tarif_total, tarif_escale = @tarif_escale WHERE id_trajet = @id');
        return 'Trajet modifié !';

    } catch (error) {

        console.log('Requête update trajet error : ' + error);
        return error;
    }
}


export async function getTrajetDate(email) {

    // * liste des dates des trajets de l'utilisateur ordonnée par rapport à la date
    // * Liste retournée contient que les dates des trajets qui ne doivent pas être supprimées
    // * Un trajet est sensé être supprimé si validite = 1

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('email', email)
                        .query('SELECT date_trajet FROM trajet WHERE email_chauffeur=@email and validite=0 ORDER BY date_trajet');

        return result.recordset;

    } catch (error) {

        console.log('Requête getTrajet error : ' + error);
        return error;
    }
}


export async function deleteTrajetDate(date) {

    // * met la valeur à 1 du champs validité pour tout les trajets 'périmés'

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('date', date)
                .query('UPDATE trajet SET validite=1 WHERE date_trajet = @date');

        const trajet_a_supprimer = await pool.request()
                    .query('SELECT * FROM trajet WHERE validite=1 ORDER BY date_trajet');

        return trajet_a_supprimer.recordsets;

    } catch (error) {

        console.log('Delete trajet date error ' + error);
        return error;
    }
}

//#endregion


//#region demandes 
export async function registerDemande(nom_chauffeur, prenom_chauffeur, numero_chauffeur, email_chauffeur,
                                        nom_voyageur, prenom_voyageur, numero_voyageur, email_voyageur,
                                        adresse_depart, adresse_arrive, date_trajet, heure_trajet, tarif) {


    try {
        
        const status = 'attente';
        const validite = 0;
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('nom_chauffeur', nom_chauffeur)
                    .input('prenom_chauffeur', prenom_chauffeur)
                    .input('numero_chauffeur', numero_chauffeur)
                    .input('email_chauffeur', email_chauffeur)
                    .input('nom_voyageur', nom_voyageur)
                    .input('prenom_voyageur', prenom_voyageur)
                    .input('numero_voyageur', numero_voyageur)
                    .input('email_voyageur', email_voyageur)
                    .input('adresse_depart', adresse_depart)
                    .input('adresse_arrive', adresse_arrive)
                    .input('date_trajet', date_trajet)
                    .input('heure_trajet', heure_trajet)
                    .input('tarif', tarif)
                    .input('status_demande', status)
                    .input('validite', validite)
                .query('INSERT INTO demandes VALUES (@nom_chauffeur, @prenom_chauffeur, @numero_chauffeur, @email_chauffeur, @nom_voyageur, @prenom_voyageur, @numero_voyageur, @email_voyageur, @adresse_depart, @adresse_arrive, @date_trajet, @heure_trajet, @tarif, @status_demande, @validite)');
        
        return 'Demande enregistré';

    } catch (error) {
        console.log('Requête register demande error : ' + error);
    }
}

export async function getDemandeChauffeur(email_chauffeur) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                    .input('email', email_chauffeur)
                                .query('SELECT * FROM demandes WHERE email_chauffeur=@email ORDER BY date_trajet');

        return result.recordsets;

    } catch (error) {
        console.log('Requête get demande chauffeur error : ' + error);
    }
}

export async function getDemandeVoyageur(email_voyageur) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                    .input('email', email_voyageur)
                                .query('SELECT * FROM demandes WHERE email_voyageur=@email ORDER BY date_trajet');

        return result.recordsets;

    } catch (error) {
        console.log('Requête get demande voyageur error : ' + error);
    }
}

export async function getDemande() {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                .query('SELECT * FROM demandes ORDER BY date_trajet DESC');

        return result.recordsets;
    } catch (error) {
        console.log('Requête get demande error ' + error);
    }
}

export async function updateDemandeStatus(id, status) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('id_demande', id)
                    .input('status_demande', status)
                .query('UPDATE demandes SET status_demande=@status_demande WHERE id_demande=@id_demande');

    } catch (error) {
        console.log('Requête updateDemandeStatus error : ' + error);
    }
}

export async function getDemandeDate() {

    // * liste des dates des demandes de l'utilisateur ordonnée par rapport à la date
    // * Liste retournée contient que les dates des demandes qui ne doivent pas être supprimées
    // * Un trajet est sensé être supprimé si validite = 1

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .query('SELECT date_trajet FROM demandes WHERE validite=0');

        return result.recordset;

    } catch (error) {
        console.log('Requête getTrajet error : ' + error);
        return error;
    }
}

export async function deleteDemande(date) {

   // * met la valeur à 1 du champ validité pour toutes les demandes 'périmées'

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();

        await pool.request()
                    .input('date', date)
                .query('UPDATE demandes SET validite=1 WHERE date_trajet = @date');

        const trajet_a_supprimer = await pool.request()
                    .query('SELECT * FROM demandes WHERE validite=1 ORDER BY date_trajet');

        return trajet_a_supprimer.recordsets;

    } catch (error) {

        console.log('Delete trajet date error ' + error);
        return error;
    }
}


//#endregion


//#region notification


export async function notificationChauffeur(email) {

    try {
        
        const status = 'attente';
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                    .input('email', email)
                                    .input('status', status)
                                .query('SELECT * FROM demandes WHERE email_chauffeur=@email and status_demande=@status and validite=1');
        
        return result.recordsets[0].length;

    } catch (error) {
        console.log('Requête notification chauffeur error : ' + error);
    }
}

export async function notificationVoyageur(email) {

    try {
        
        const status = 'accepter';
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                                    .input('email', email)
                                    .input('status', status)
                                .query('SELECT * FROM demandes WHERE email_voyageur=@email and status_demande=@status and validite=1');
        
        return result.recordsets[0].length;

    } catch (error) {
        console.log('Requête notification chauffeur error : ' + error);
    }
}
//#endregion




