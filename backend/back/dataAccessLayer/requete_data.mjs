"use strict";
import sql from 'mssql';

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

export async function getUserData() {

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request().query('SELECT * FROM utilisateur');
        return result.recordset;
    } catch (error) {
        console.log('requete_getData, erreur : ' + error);
    }

}

export async function updateDbUser(id, nom, prenom, email, numero, typeUser, motDePasse) {

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('id', id)
            .input('nom', nom)
            .input('prenom', prenom)
            .input('email', email)
            .input('numero', numero)
            .input('typeUser', typeUser)
            .input('motDePasse', motDePasse)
            .query('UPDATE utilisateur set nom = @nom, prenom = @prenom, email = @email, numero = @numero, typeUser = @typeUser, motDePasse = @motDePasse WHERE id_utilisateur = @id');
    } catch (error) {
        console.log('Requete-register, erreur : ' + error);
    }
}

export async function deleteDbUser(id) {

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('id', id)
            .query('DELETE utilisateur WHERE id_utilisateur = @id');
    } catch (error) {
        console.log('Delete user db : ' + error);
    }
}