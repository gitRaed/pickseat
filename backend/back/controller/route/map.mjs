"use strict";
import express from "express";
import bodyParser from "body-parser";
import {
    isAuth
} from '../../serviceLayer/isAuth.mjs';
import {
    authCodeEmail
} from '../../serviceLayer/code_data.mjs';
import {
    codeGetPointImportant,
    codeRegisterMessage,
    codePointImportant, 
    codeUpdatePointImportant,
    codeDeletePointImportant
} from '../../serviceLayer/code_map.mjs';

const route = express.Router();


route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(express.json());



route.post("/getPointImportant", async (req, res) => {

    res.status(200);

    const authorization = req.headers.authorization.valueOf('authorization');
    const email = req.body.email;

    try {

        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if (verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        } else {

             // verifier si l'email est disponible dans la bdd
            authCodeEmail(email).then((result) => {

                console.log(result.auth);
                if (result.auth === true) {
                    // enregister dans la bdd et envoyer le résultat
                    codeGetPointImportant(email).then((result) => {
                        res.send({
                            message: result
                        });
                    });
                } else {

                    res.send({
                        message: 'L\'utilisateur n\'existe pas',
                        reqBody: req.body
                    });
                }

            });
        }
    } catch (error) {
        console.log('Get points important error : ' + error);
        res.send({
            message: 'Get points important error : ' + error
        });
    }
});


route.post("/contactUs", async (req, res) => {

    res.status(200);

    const authorization = req.headers.authorization.valueOf('authorization');
    let email = req.body.email;
    let message = req.body.message;
    /*console.log(req.body);
    console.log('Email : ' + email + ', message : ' + message);
    console.log('Token value : ' + authorization);*/

    try {
        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if (verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        } else {

            // verifier si l'email est disponible dans la bdd
            authCodeEmail(email).then((result) => {

                console.log(result.auth);
                if (result.auth === true) {
                    // enregister dans la bdd et envoyer le résultat
                    codeRegisterMessage(email, message).then((result) => {
                        res.send({
                            message: result
                        });
                    });
                } else {

                    res.send({
                        message: 'L\'utilisateur n\'existe pas',
                        reqBody: req.body
                    });
                }

            });


        }
    } catch (error) {
        console.log('Contact us error : ' + error);
        res.send({
            message: error
        });
        res.status(500);
    }
});

route.post("/pointImportant", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');

    const email = req.body.email;
    const message = req.body.message;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    try {

        res.status(200);
        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if (verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        } else {

            // verifier si l'email est disponible dans la bdd
            authCodeEmail(email).then((result) => {

                console.log(result.auth);
                if (result.auth === true) {
                    // enregister dans la bdd et envoyer le résultat
                    codePointImportant(email, message, latitude, longitude).then((result) => {
                        res.send({
                            message: result
                        });
                    });
                } else {

                    res.send({
                        message: 'L\'utilisateur n\'existe pas',
                        reqBody: req.body
                    });
                }

            });


        }
    } catch (error) {

        res.status(500);
        console.log('Point important error : ' + error);
        res.send({
            message: error
        });
        res.status(500);
    }
});

route.post("/updatePoint", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');

    const id = req.body.id;
    const email = req.body.email;
    const message = req.body.message;


    try {

        res.status(200);
        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if (verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        }   // verifier si l'email est disponible dans la bdd
        authCodeEmail(email).then((result) => {

            console.log(result.auth);
            if (result.auth === true) {
                // enregister dans la bdd et envoyer le résultat
                codeUpdatePointImportant(id, message).then((result) => {
                    res.send({
                        message: result
                    });
                });
            } else {

                res.send({
                    message: 'L\'utilisateur n\'existe pas',
                    reqBody: req.body
                });
            }

        });
    } catch (error) {
        res.status(500);
        res.send({
            message: error
        });
    }
});

route.post("/deletePoint", async (req, res) => {

    
    const authorization = req.headers.authorization.valueOf('authorization');
    const id = req.body.id;

    try {
        res.status(200);
        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if (verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        } else {

            codeDeletePointImportant(id).then( (result) => {
                res.send({
                    message: result
                });
            });
        }
    } catch (error) {
        res.status(500);
        res.send({
            message: error
        });
    }

});

export {
    route as map
};