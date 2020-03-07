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