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