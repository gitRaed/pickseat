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
    codeRegisterMessage
} from '../../serviceLayer/code_map.mjs';

const route = express.Router();


route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(express.json());



route.post("/contactUs", async (req, res) => {

    res.status(200);

    const authorization = req.headers.authorization.valueOf('authorization');
    let email = req.body.email;
    let message = req.body.message;
    console.log(req.body);
    console.log('Email : ' + email + ', message : ' + message);
    console.log('Token value : ' + authorization);

    try {
        // verifier si token es envoyé en header
        const verifToken = isAuth(authorization);
        if(verifToken.message !== '') {
            res.send({
                message: verifToken.message
            });
        } else {
    
            // verifier si l'email est disponible dans la bdd
            authCodeEmail(email). then ( (result) => {

                console.log(result.auth);
                if (result.auth === true) {
                    // enregister dans la bdd et envoyer le résultat
                    codeRegisterMessage(email, message).then( (result) => {
                        res.send({
                            message: result
                        });
                    });
                } else {
    
                    res.send({
                        message: 'L\'utilisateur n\'existe pas',
                        reqBody : req.body 
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

route.post("contactUs", async (req, res) => {

});

export {
    route as map
};