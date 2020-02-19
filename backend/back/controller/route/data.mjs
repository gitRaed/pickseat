"use strict";
import express from "express";
import bodyParser from "body-parser";

import {
    getUser, updateUser, deleteUser
} from '../../serviceLayer/code_data.mjs';

const route = express.Router();


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

route.post('/updateData', async function (req, res) {

    const id = req.body.id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const numero = req.body.numero;
    const typeUser = req.body.typeUser;
    const motDePasse = req.body.motDePasse;

    res.status(200);

    // console.log(id, nom, prenom, email, numero, typeUser, motDePasse);
    updateUser(id, nom, prenom, email, numero, typeUser, motDePasse).then(() => 
        res.json({
            message: 'Donnée reçues ' + nom + ' ' + prenom
        }));
    
});

route.post('/deleteData', async function (req, res) {

    const id = req.body.id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;

    res.status(200);

    deleteUser(id).then(() => 
        res.json({
            message: 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !'
        }));
});


export {
    route as data
};