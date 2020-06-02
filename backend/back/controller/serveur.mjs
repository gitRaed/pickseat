"use strict";
import { createServer } from 'http';
import { app } from './app';

var port = process.env.PORT || 9500;

createServer(app).listen(port);