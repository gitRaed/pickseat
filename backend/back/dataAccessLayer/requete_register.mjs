"use strict";

import sql from "mssql";

var config = {
    user: 'sa',
    password: 'raed',
    server: 'localhost',
    database: 'pixil',
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    },
};

export async function registerUser(nom, prenom, email, numero, typeUser, motDePasse) {

    // console.log(nom, prenom, email, numero, typeUser, motDePasse);
    try {
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('nom', nom)
            .input('prenom', prenom)
            .input('email', email)
            .input('numero', numero)
            .input('typeUser', typeUser)
            .input('motDePasse', motDePasse)
            .query('INSERT INTO utilisateur VALUES (@nom, @prenom, @email, @numero, @typeUser, @motDePasse)');
    } catch (error) {
        console.log('Requete-register, erreur : ' + error);
    }

}