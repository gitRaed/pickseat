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

import { verif } from '../../serviceLayer/service/verif.mjs';
import { createAccessToken } from '../../serviceLayer/service/token.mjs';

const route = express.Router();

route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(express.json());

// TODO 1 : Vérifier toutes les données reçues du front
// TODO 2 : Mettre un interceptor pour toutes les routes et celui-ci décidera quelle route emprunter

route.post('/getData', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData !== '') {

            res.status(400);
            res.send({
                message : verifData
            });

        } else {

            res.status(200);

            getUser(email).then((result) => {
                res.send(result);
            });
        }

    } catch (error) {

        res.status(500);
        console.log('Get data error : ' + error);
    }

});


//#region optionsUser
route.post('/ban', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, id, nom, prenom} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            banCode(id).then(() => {
                res.json({
                    message: 'Utilisateur banni : ' + nom + ' ' + prenom
                });
            });
            
        }

    } catch (error) {
        res.status(500);
        console.log('Ban user error : ' + error);
    }

});

route.post('/suspend', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, id, nom, prenom} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            suspendCode(id).then(() => {

                res.json({
                    message: 'Utilisateur suspendu : ' + nom + ' ' + prenom
                });
            });

        }

    } catch (error) {
        res.status(500);
        console.log('Suspendre user error : ' + error);
    }

});

route.post('/normal', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, id, nom, prenom} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            normalCode(id).then(() => {

                res.json({
                    message: 'Utilisateur remis actif : ' + nom + ' ' + prenom
                });
            });
        }

    } catch (error) {
        res.status(500);
        console.log('Normal user error : ' + error);
    }

});

route.post('/updateData', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {emailVerif, id, nom, prenom, email,numero, typeUser} = req.body;

    try {

        const verifData = await verif(authorization, emailVerif);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            // console.log(id, nom, prenom, email, numero, typeUser, motDePasse);
            updateUser(id, nom, prenom, email, numero, typeUser).then(() => {

                res.json({
                    message: 'Données de ' + nom + ' ' + prenom + ' modifiées ! '
                });
            });
        }

    } catch (error) {
        res.status(500);
        console.log('Update data error : ' + error);
    }

});

route.post('/deleteData', async function (req, res) {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, id, nom, prenom} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction 'verif' vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            deleteUser(id).then(() => {

                res.json({
                    message: 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !'
                });
            });

        }

    } catch (error) {
        res.status(500);
        console.log('Delete user error : ' + error);
    }

});

//#endregion


// *la premiere condition gère les authentification et la deuxieme les enregistrements
// TODO: Séparer authentification et register en 2 routes distinctes
route.get('/auth/:email/:mdp/:type', async function (req, res) {

    const email = req.params.email;
    const motDePasse = req.params.mdp;
    const type = req.params.type;
    
    // *si type === auth, check si le mdp et email sont bien disponibles, 
    // *si type === register, juste check si l'email est disponible
    if (type === 'auth') {

        authCode(email, motDePasse).then((result) => {

            // si le user est authentifié, envoyer un accessToken en réponse normal
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