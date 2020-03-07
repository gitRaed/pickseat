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

import { createAccessToken } from '../../serviceLayer/token.mjs';

const route = express.Router();

//#region variables
let id, nom, prenom, email, numero, typeUser, motDePasse, type;
//#endregion

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


//#region route-options
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

//#endregion

// la premiere condition gère les authentification et la deuxieme les enregistrements
// TODO: Séparer authentification et register en 2 routes distinctes
route.get('/auth/:email/:mdp/:type', async function (req, res) {

    email = req.params.email;
    motDePasse = req.params.mdp;
    type = req.params.type;
    
    // si type === auth, check si le mdp et email sont bien disponible, 
    // si type === register, juste check si l'email est disponible
    if (type === 'auth') {
        authCode(email, motDePasse).then((result) => {

            // si le user est authentifié, envoyer un accessToken en reponse normal et un refreshToken en cookie
            if (result.auth === true) {
                result.token = createAccessToken();
            }

            res.send(result);
        });
    } else if (type === 'register') {

        authCodeEmail(email).then((result) => {

            res.send(result);
        });
    }
});

export {
    route as data
};