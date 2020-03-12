"use strict";

import {
    getPointImportant,
    registerMessage,
    registerPointImportant,
    updatePointImportant,
    deletePointImportant
} from '../dataAccessLayer/requete_map.mjs';


export async function codeGetPointImportant(email) {

    return getPointImportant(email).then( (result) => {

        let data = [];

        for(let i = 0, n = result.length; i < n; i++) {

            data.push({
                id_points : result[i].id_points,
                message : result[i].message,
                latitude : result[i].latitude,
                longitude : result[i].longitude 
            });
        }

        return data;
    });
}


export async function codeRegisterMessage(email, message) {

    return registerMessage(email, message);
}

export async function codePointImportant(email, message, latitude, longitude) {

    return registerPointImportant(email, message, latitude, longitude);
}

export async function codeUpdatePointImportant(id, message) {

    return updatePointImportant(id, message);
}

export async function codeDeletePointImportant(id) {

    return deletePointImportant(id);
}