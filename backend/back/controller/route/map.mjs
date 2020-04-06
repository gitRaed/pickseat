"use strict";
import express from "express";
import bodyParser from "body-parser";

import {
    verif
} from '../../serviceLayer/service/verif.mjs';

import {
    isAuth
} from '../../serviceLayer/service/isAuth.mjs';
import {
    authCodeEmail
} from '../../serviceLayer/code_data.mjs';
import {
    codeGetPointImportant,
    codeRegisterMessage,
    codePointImportant, 
    codeUpdatePointImportant,
    codeDeletePointImportant,
    codeAlarme,
    codeGetTrajet,
    codeRechercherTrajet,
    codeEnregistrerTrajet,
    codeUpdateTrajet,
    codeDeleteTrajet
} from '../../serviceLayer/code_map.mjs';

const route = express.Router();


route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(express.json());



route.post("/contactUs", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, message} = req.body;

    try {

        res.status(200);

        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if (verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        }  else {

            codeRegisterMessage(email, message).then((result) => {
                res.send({
                    message: result
                });
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


//#region point important

route.post("/getPointImportant", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const email = req.body.email;

    try {

        res.status(200);

        const verifData = await verif(authorization, email);
        // * la fonction verfi vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message: verifData.message
            });

        } else {

             // return les points importants
            codeGetPointImportant(email).then((result) => {
                res.send({
                    message: result
                });
            });
        }

    } catch (error) {

        res.status(500);
        console.log('Get points important error : ' + error);
        res.send({
            message: 'Get points important error : ' + error
        });
    }
});

route.post("/pointImportant", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');

    const {email, message, latitude, longitude, sonner} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if (verifData.bool === false) {

            res.send({
                message : verifData.message
            });
        } else {

            // * enregistrer le point 
            codePointImportant(email, message, latitude, longitude, sonner).then((result) => {
                res.send({
                    message: result
                });
            });
        }

    } catch (error) {

        res.status(500);
        console.log('Point important error : ' + error);
        res.send({
            message: error
        });
    }
});

route.post("/updatePoint", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {id, email, message, sonner} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeUpdatePointImportant(id, message, sonner).then((result) => {
                res.send({
                    message: result
                });
            });
        }

    } catch (error) {

        res.status(500);
        console.log('Update point important error : ' + error);
        res.send({
            message: error
        });
    }
});

route.post("/deletePoint", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {id, email} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
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
        console.log('Delete point important error : ' + error);
        res.send({
            message: error
        });
    }

});

route.post("/alarme", async (req, res) => {
    
    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, latitude, longitude} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            
            codeAlarme(email, parseFloat(latitude), parseFloat(longitude)).then( (result) => {
                res.send({
                    isDist : result.isDist,
                    libelle : result.libelle
                });
            });

        }

    } catch (error) {

        res.status(500);
        console.log('Alarme error : ' + error);
        res.send({
            message: error
        });
    }
    
});

//#endregion


//#region trajet

route.post("/getTrajet", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeGetTrajet(email).then((result) => {
                res.send({
                    message: result
                });
            });

        }

    } catch (error) {

        res.status(500);
        console.log('Get trajet error : ' + error);
        res.send({
            message: error
        });
    }

});

route.post("/rechercherTrajet", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, adresseDepart, adresseArrive} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeRechercherTrajet(email, adresseDepart, adresseArrive).then( (result) => {
                res.send({
                    message: result
                });
            });

        }
    } catch(error) {

        res.status(500);
        console.log('Rechercher trajet error : ' + error);
        res.send({
            message : error
        });
    }

});

route.post("/enregistrerTrajet", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {nom, prenom, email, numero, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale, tarifTotal, tarifEscale} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeEnregistrerTrajet(nom, prenom, email, numero, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale, tarifTotal, tarifEscale).then((result) => {
                res.send({
                    message: result
                });
            });

        }

    } catch(error) {

        res.status(500);
        console.log('Enregistrer trajet error : ' + error);
        res.send({
            message : error
        });
    }
});

route.post("/updateTrajet", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {id, email, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale, tarifTotal, tarifEscale} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeUpdateTrajet(id, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale, tarifTotal, tarifEscale).then((result) => {
                res.send({
                    message: result
                });
            });

        }

    } catch (error) {
        res.status(500);
        console.log('Update trajet error : ' + error);
        res.send({
            message: error
        });
    }
});

route.post("/deleteTrajet", async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {id, email} = req.body;

    try {

        res.status(200);
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.send({
                message : verifData.message
            });

        } else {

            codeDeleteTrajet(id).then((result) => {
                res.send({
                    message: result
                });
            });

        }

    } catch (error) {
        res.status(500);
        console.log('Supprimer trajet error : ' + error);
        res.send({
            message: error
        });
    }
});
//#endregion



export {
    route as map
};