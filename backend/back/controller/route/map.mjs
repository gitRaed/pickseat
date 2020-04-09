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
    codeDeleteTrajet,
    codeRegisterDemande,
    codeGetDemandeUser,
    codeGetDemande,
    codeUpdateDemandeStatus,
    codeNotification
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

        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if (verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        }  else {

            res.status(200);
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

        const verifData = await verif(authorization, email);
        // * la fonction verfi vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message: verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if (verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });
        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
    
    // * cette route permet de savoir si la position reçue est proche d'un des points importants de l'utilisateur

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, latitude, longitude} = req.body;

    try {
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

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


//#region demandes

route.post('/registerDemande', async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {emailChauffeur, emailVoyageur, adresseDepart, adresseArrive, dateTrajet, heureTrajet, tarif} = req.body;

    try {

        const verifData = await verif(authorization, emailVoyageur);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe
        // * on vérifie ici avec l'email du voyageur car il c'est normalement que lui qui peut enregistrer une demande

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            codeRegisterDemande(emailChauffeur, emailVoyageur, adresseDepart, adresseArrive, dateTrajet, heureTrajet, tarif).then ( (result) => {

                res.send({
                    message : result
                });
            });
        }

    } catch (error) {

        res.status(500);
        console.log('Register demande error : ' + error);
        return error;
    }
});

route.post('/getDemandeUser', async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, typeUser} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            codeGetDemandeUser(email, typeUser).then( (result) => {
                res.send({
                    message : result
                });
            });
        }

    } catch (error) {
        res.status(500);
        console.log('Get demande error : ' + error);
        return error;
    }
});

route.post('/getDemande', async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            codeGetDemande().then( (result) => {
                res.send({
                    message : result
                });
            });
        }

    } catch (error) {
        res.status(500);
        console.log('Get demande error : ' + error);
        return error;
    }
});

route.post('/updateDemande', async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, id, status} = req.body;

    try {

        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            codeUpdateDemandeStatus(id, status).then( (result) => {
                res.send({
                    message : result
                });
            });
        }

    } catch (error) {
        res.status(500);
        console.log('Get demande error : ' + error);
        return error;
    }
});

//#endregion


//#region notifications

route.post('/notifications', async (req, res) => {

    const authorization = req.headers.authorization.valueOf('authorization');
    const {email, typeUser} = req.body;

    try {
        
        const verifData = await verif(authorization, email);
        // * la fonction verif vérifie si le token existe et si l'utilisateur existe

        if(verifData.bool === false) {

            res.status(400);
            res.send({
                message : verifData.message
            });

        } else {

            res.status(200);

            codeNotification(email, typeUser).then( (result) => {

                res.send({
                    length : result
                });
            });

        }

    } catch (error) {
        console.log('Notification error : ' + error);
    }
});
//#endregion

export {
    route as map
};