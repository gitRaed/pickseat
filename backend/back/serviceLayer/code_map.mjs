"use strict";

import {
    registerMessage
} from '../dataAccessLayer/requete_map.mjs';


export async function codeRegisterMessage(email, message) {

    return registerMessage(email, message);
}