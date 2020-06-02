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

export async function getUserData() {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request().query('SELECT * FROM utilisateurs');
        return result.recordset;

    } catch (error) {

        console.log('requete_getData, erreur : ' + error);
    }

}

export async function statusDb(id, status_compte) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
                    .input('id', id)
                    .input('status_compte', status_compte)
                    .query('UPDATE utilisateurs SET status_compte = @status_compte WHERE id_utilisateur = @id');

    } catch (error) {

        console.log('banDb : ' + error);
    }
}

export async function updateDbUser(id, nom, prenom, email, numero, typeUser) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('id', id)
            .input('nom', nom)
            .input('prenom', prenom)
            .input('email', email)
            .input('numero', numero)
            .input('typeUser', typeUser)
            .query('UPDATE utilisateurs set nom = @nom, prenom = @prenom, email = @email, numero = @numero, typeUser = @typeUser WHERE id_utilisateur = @id');
    
    } catch (error) {

        console.log('Requete-register, erreur : ' + error);
    }
}

export async function deleteDbUser(id) {

    try {

        const pool = await new sql.ConnectionPool(config).connect();
        await pool.request()
            .input('id', id)
            .query('DELETE utilisateurs WHERE id_utilisateur = @id');

    } catch (error) {

        console.log('Delete user db : ' + error);
    }
}

export async function authDbEmail(email) {
    
    try {

        const pool = await new sql.ConnectionPool(config).connect();
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM utilisateurs WHERE email = @email');
            return result.recordset;

    } catch (error) {

        console.log('Requete-register, erreur : ' + error);
    }
}
