"use strict";

import {
    decrypt
} from './crypter.mjs';


const superAdminTable = [
    '3beb796f7fc956fb344f23439636e46fa5cd51c038488dcba58fc55c07d4a47c' // *raed
];

const adminTable = [
    '62c44e39076c428c36a710ba4f81ee27c1c04f2f4168feb3ad18fc33d0761a59' // *flow
];


export async function admin(email) {

    // * cette fonction check si l'email correspond à celui d'un admin (flow)

    let bool = false;

    for (let i = 0, n = adminTable.length; i < n; i++) {

        const Decrypted = decrypt(adminTable[i]);

        if (email === Decrypted) {
            bool = true;
            return bool;
        }
    }

    return bool;
}


export function superAdmin(email) {

    // * cette fonction check si l'email correspond à celui d'un super admin (moi)

    let bool = false;

    for (let i = 0, n = superAdminTable.length; i < n; i++) {

        const Decrypted = decrypt(superAdminTable[i]);

        if (email === Decrypted) {
            bool = true;
            return bool;
        }
    }

    return bool;
}