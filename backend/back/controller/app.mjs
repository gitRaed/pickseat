"use strict";
import * as env from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import xss from 'xss-clean';

env.config();
import {
    data
} from './route/data.mjs';

import {
    register
} from './route/register.mjs';

import {
    map
} from './route/map.mjs';

import express from "express";
const app = express();

app.use(function (req, res, next) { // *permet le cross origin        
    //console.log('request', req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, authorization ");
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
      //move on
        next();
    }
});

app.use(helmet()); // * protège l'application contre certaines vulnérabilités http
app.use(compression()); // *compresse toutes les routes pour que le client ait sa réponse + vite
app.use(express.json({ limit: '10kb' })); // *limite la réponse à 10 kb
app.use(xss()); // *Data Sanitization against XSS


app.use("/data", data);

app.use("/register", register);

app.use("/map", map);

export {
    app
};