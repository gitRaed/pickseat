"use strict";
import {
    registerData,
    registerFinalCode
} from '../../serviceLayer/code_register.mjs';
import * as nodemailer from 'nodemailer';

import express from "express";
import bodyParser from "body-parser";
const route = express.Router();

//#region variable
let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "applicationPixil@gmail.com",
        pass: "pixilMotDePasse"
    }
});
let rand, mailOptions, host, link;
let nom, prenom, email, numero, typeUser,status_validation, status_compte, motDePasse;
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

route.post("/", async (req, res, next) => {

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
        subject: "Please confirm your Email account",
        html: "Hello " + nom +" " + prenom + ",<br> Please Click on the link bellow to validate your account.<br><a href=" + link + ">Click here to verify</a>"
    };
    // console.log('mailOptions.to : ' + mailOptions.to + ' \n mailOptions.subject ' + mailOptions.subject +' \n mailOptions.html' + mailOptions.html);

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

    // console.log(req.protocol + ":/" + req.get('host'));

    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        // console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
    
            status_validation = "Accepté";
            status_compte = "Actif";
            console.log("\n", email, status_validation, status_compte);
            registerFinalCode(email, status_validation, status_compte).then ( () => {
                res.json({
                    message: 'Your account has been registered ! Click here to authenticate urself',
                });
            });
            
        } else {
            status_validation = "Rejeté";
            status_compte = "Banni";
            console.log("\n", email, status_validation, status_compte);
            registerFinalCode(email, status_validation, status_compte).then ( () => {
                res.json({
                    message: 'Bad request, your accounst has not been registered',
                });
            });
        }
    } else {
        res.json({
            message: "Request is from unknow source",
        });
    }
});


export {
    route as register
};