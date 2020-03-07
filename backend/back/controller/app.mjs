"use strict";
import * as env from 'dotenv';
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

app.use(function (req, res, next) { //permet le cross origin        
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




app.use("/data", data);

app.use("/register", register);

app.use("/map", map);

export {
    app
};