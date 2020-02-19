"use strict";
import {
    recupererData
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
let nom, prenom, email, numero, typeUser, motDePasse;
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

    res.status(200);

    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://localhost:9500/register/verify?id=" + rand;
    mailOptions = {
        to: email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
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
            // console.log("email is verified \n");
            recupererData(nom, prenom, email, numero, typeUser, motDePasse).then(() => {
                res.json({
                    message: "Email " + mailOptions.to + " is been Successfully verified, yout account has been registered",
                });
            });
        } else {
            console.log("email is not verified");
            res.json({
                message: "Bad request",
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