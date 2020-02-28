"use strict";
import express from "express";
import bodyParser from "body-parser";

import {
    getUser,
    updateUser,
    deleteUser,
    authCode,
    authCodeEmail,
    banCode,
    suspendCode,
    normalCode
} from '../../serviceLayer/code_data.mjs';

const route = express.Router();

//#region variables
let id, nom, prenom, email, numero, typeUser, motDePasse, type;
//#endregion

route.use(function (req, res, next) {
    // console.log("Request", req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});
route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(express.json());


route.get("/getData", async function (req, res) {

    res.status(200);
    getUser().then((result) => {
        res.send(result);
    });

});

route.post('/ban', async function (req, res) {

    id = req.body.id;
    nom = req.body.nom;
    prenom = req.body.prenom;

    res.status(200);

    banCode(id).then(() =>
    res.json({
        message: 'Utilisateur banni : ' + nom + ' ' + prenom
    }));
});

route.post('/suspend', async function (req, res) {

    id = req.body.id;
    nom = req.body.nom;
    prenom = req.body.prenom;

    res.status(200);

    suspendCode(id).then(() =>
    res.json({
        message: 'Utilisateur suspendu : ' + nom + ' ' + prenom
    }));
});

route.post('/normal', async function (req, res) {

    id = req.body.id;
    nom = req.body.nom;
    prenom = req.body.prenom;

    res.status(200);

    normalCode(id).then(() =>
    res.json({
        message: 'Utilisateur remis actif : ' + nom + ' ' + prenom
    }));
});

route.get('/auth/:email/:mdp/:type', async function (req, res) {

    email = req.params.email;
    motDePasse = req.params.mdp;
    type = req.params.type;

    res.status(200);
    // si type === auth, check si le mdp et email sont bien disponible, si type === register, juste check si l'email est disponible
    if (type === 'auth') {
        authCode(email,motDePasse).then( (result) => {

            res.send(result);
    
            if (result.auth) {
    
                // token params
                
            }
        });
    } else if (type === 'register') {

        authCodeEmail(email).then( (result) => {

            res.send(result);
        });
    }
});

route.post('/updateData', async function (req, res) {

    id = req.body.id;
    nom = req.body.nom;
    prenom = req.body.prenom;
    email = req.body.email;
    numero = req.body.numero;
    typeUser = req.body.typeUser;

    res.status(200);

    // console.log(id, nom, prenom, email, numero, typeUser, motDePasse);
    updateUser(id, nom, prenom, email, numero, typeUser).then(() =>
        res.json({
            message: 'Donnée reçues ' + nom + ' ' + prenom
        }));

});

route.post('/deleteData', async function (req, res) {

    id = req.body.id;
    nom = req.body.nom;
    prenom = req.body.prenom;

    res.status(200);

    deleteUser(id).then(() =>
        res.json({
            message: 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !'
        }));
});



export {
    route as data
};