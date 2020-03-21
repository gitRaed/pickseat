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

export async function registerPointImportant(email, message, latitude, longitude) {

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('email', email)
            .input('message', message)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .query('INSERT INTO pointImportant VALUES (@email, @message, @latitude, @longitude)');
            return 'Point important enregistré!';
    } catch (error) {
        console.log('Register point important error : ' + error);
        return 'Register point important error : ' + error;
    }
}

export async function updatePointImportant(id, message) {

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                .input('id', id)
                .input('message', message)
                .query('UPDATE pointImportant SET message=@message WHERE id_points=@id');
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

export async function getTrajet(email) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('email', email)
                        .query('SELECT * FROM trajet WHERE email=@email');
        return result.recordset;
    } catch (error) {
        console.log('Requête getTrajet error : ' + error);
        return error;
    }
}

export async function rechercherTrajet1(adresse_depart, adresse_arrive, heure_trajet, date_trajet) {

    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
                        .input('adresse_depart', adresse_depart)
                        .input('adresse_arrive', adresse_arrive)
                        .input('heure_trajet', heure_trajet)
                        .input('date_trajet', date_trajet)
                        .query('SELECT * FROM trajet WHERE adresse_depart=@adresse_depart and adresse_arrive=@adresse_arrive and heure_trajet=@heure_trajet and date_trajet=@date_trajet ORDER BY heure_trajet');
        return result.recordset;

    } catch (error) {
        console.log('Rerchercher trajet error : ' + error);
        return error;
    }
}

export async function enregistrerTrajet(email, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {
    
    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('email', email)
                    .input('adresse_depart', adresse_depart)
                    .input('adresse_arrive', adresse_arrive)
                    .input('heure_trajet', heure_trajet)
                    .input('date_trajet', date_trajet)
                    .input('options', options)
                    .input('escale', escale)
                .query('INSERT INTO trajet VALUES (@email, @adresse_depart, @adresse_arrive, @heure_trajet, @date_trajet, @options, @escale)');
        return 'Trajet enregistré !';
    } catch (error) {
        console.log('Requête enregistrer trajet error : ' + error);
        return error;
    }
}

export async function updateTrajet(id, adresse_depart, adresse_arrive, heure_trajet, date_trajet, options, escale) {
    
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
                .query('UPDATE trajet SET adresse_depart = @adresse_depart, adresse_arrive = @adresse_arrive, heure_trajet = @heure_trajet, date_trajet = @date_trajet, options = @options, escale = @escale WHERE id_trajet = @id');
        return 'Trajet modifié !';
    } catch (error) {
        console.log('Requête update trajet error : ' + error);
        return error;
    }
}

export async function deleteTrajet(id) {
    
    try {
        
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('id', id)
                .query('DELETE trajet WHERE id_trajet = @id');
        return 'Trajet supprimé !';
    } catch (error) {
        console.log('Requête delete trajet error : ' + error);
        return error;
    }
}