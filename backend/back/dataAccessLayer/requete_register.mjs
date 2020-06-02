"use strict";

import sql from "mssql";

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

export async function registerUser(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse) {


    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('nom', nom)
            .input('prenom', prenom)
            .input('email', email)
            .input('numero', numero)
            .input('typeUser', typeUser)
            .input('motDePasse', motDePasse)
            .input('status_validation', status_validation)
            .input('status_compte', status_compte)
            .query('INSERT INTO utilisateurs VALUES (@nom, @prenom, @email, @numero, @typeUser, @status_validation, @status_compte, @motDePasse)');
    
    } catch (error) {
        
        console.log('Requete-register, erreur : ' + error);
    }

}

export async function registerFinal(email, status_validation, status_compte,) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('email', email)
            .input('status_validation', status_validation)
            .input('status_compte', status_compte)
            .query('UPDATE utilisateurs SET status_validation = @status_validation, status_compte = @status_compte WHERE email = @email');

    } catch (error) {

        console.log('register final error : ' + error);
    }
}

export async function resetPasswordDb(email, motDePasse) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('email', email)
            .input('motDePasse', motDePasse)
            .query('UPDATE utilisateurs SET motDePasse = @motDePasse WHERE email = @email');

    } catch (error) {

        console.log('register final error : ' + error);
    }
}