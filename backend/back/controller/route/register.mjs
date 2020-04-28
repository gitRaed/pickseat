"use strict";
import {
    registerData,
    registerFinalCode,
    resetPasswordcode
} from '../../serviceLayer/code_register.mjs';
import * as nodemailer from 'nodemailer';

import express from "express";
import bodyParser from "body-parser";
const route = express.Router();

//#region variable
let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "pickseat.rf@gmail.com",
        pass: "pickseatMotDePasse"
    }
});
let rand, mailOptions, host, link;
let nom, prenom, email, numero, typeUser,status_validation, status_compte, motDePasse;
//#endregion


route.use(bodyParser.urlencoded({
    extended: true
})); // suuport url-encoded bodies
route.use(express.json()); // to support json-encoded bodies


//#region enregistrement
route.post("/", async (req, res) => {

    nom = req.body.nom;
    prenom = req.body.prenom;
    email = req.body.email;
    numero = req.body.numero;
    typeUser = req.body.typeUser;
    motDePasse = req.body.motDePasse;
    status_validation = "Attente";
    status_compte = "Suspendu";

    registerData(nom, prenom, email, numero, typeUser, status_validation, status_compte, motDePasse );

    res.status(200);

    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://localhost:9500/register/verify?id=" + rand;
    mailOptions = {
        to: email,
        subject: "Confirmez votre compte",
        html: "Bonjour " + nom +" " + prenom + ", merci d\'utiliser pickseat !<br>Cliquez sur le lien ci-dessous pour valider votre compte.<br><a href=" + link + ">Click here to verify</a>"
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {

        if (error) {
            console.log('Erreur sendMail : ' + error + ' \n');
            res.end("error");
        } else {
            res.end("sent");
        }
    });

});

route.get('/verify', async function (req, res) {


    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {

        if (req.query.id == rand) {
    
            status_validation = "Accepté";
            status_compte = "Actif";
            link =  "http://localhost:4200"; 
            registerFinalCode(email, status_validation, status_compte).then ( () => {
                res.send('Votre compte a été enregistré ! \n Cliquez <a href=' + link + '> ici </a> pour vous authentifier');
            });
            
        } else {

            status_validation = "Rejeté";
            status_compte = "Banni";
            registerFinalCode(email, status_validation, status_compte).then ( () => {
                res.json({
                    message: 'Bad request, your account has not been registered',
                });
            });
        }

    } else {
        res.json({
            message: "Request is from unknow source",
        });
    }
});
//#endregion



//#region mot de passe
route.post('/forgotPassword', async (req, res, next) => {

    email = req.body.email;

    host = req.get('host');
    link = "http://localhost:4200/mdpForgot/" + email;
    mailOptions = {
        to: email,
        subject: "Reset password",
        html: "Bonjour,<br> Cliquez sur le lien en dessous pour modifier votre mot de passe<br><a href=" + link + ">Click here</a>"
    };
    // console.log('mailOptions.to : ' + mailOptions.to + ' \n mailOptions.subject ' + mailOptions.subject +' \n mailOptions.html' + mailOptions.html);

    smtpTransport.sendMail(mailOptions, function (error) {

        if (error) {

            res.status(400);
            console.log('Erreur sendMail forgot password: ' + error + ' \n');
            res.end("error");

        } else {

            res.status(200);
            res.end("sent");
        }
    });
});

route.post('/resetPassword', async (req, res, next) => {

    try {

        res.status(200);

        email = req.body.email;
        motDePasse = req.body.motDePasse;
        link = "http://localhost:4200";
    
        resetPasswordcode(email, motDePasse).then( () => {
            res.send(email + ', votre mot de passe a été modifié ! Appuyer <a href=' + link + '>ici</a> pour vous authentifier ! ');
        });

    } catch (error) {
        
        res.status(400);
        console.log('Reset password error : ' + error);
    }
});
//#endregion

export {
    route as register
};