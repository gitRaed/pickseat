"use strict";
import {
    data
} from './route/data.mjs';

import {
    register
} from './route/register.mjs';

import express from "express";
const app = express();

app.use(function (req, res, next) { //permet le cross origin        
    // console.log('request', req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});


app.use("/data", data);

app.use("/register", register);


export {
    app
};