import nodeGeocoder from 'node-geocoder';
import * as geo from 'geolocation-utils';

let options = {
    provider: 'openstreetmap'
};

let geocoder = nodeGeocoder(options);

export async function distance(adresse_depart_user, adresse_arrive_user, adresse_depart_chauffeur, adresse_arrive_chauffeur) {

    let bool = false;

    const depart_user = await addressToCoordinate(adresse_depart_user);
    let arrive_user;

    const depart_chauffeur = await addressToCoordinate(adresse_depart_chauffeur);
    let arrive_chauffeur;

    
    const isDistanceGood = await distanceBetweenAdress(depart_user, depart_chauffeur); 
    // * isDistanceGood = true si la distance entre les 2 adresses est inférieure ou égale à 1km
    
    if (isDistanceGood === true) {
        bool = true;
        arrive_user = await addressToCoordinate(adresse_arrive_user);
        arrive_chauffeur = await addressToCoordinate(adresse_arrive_chauffeur);
    }

    return {
        bool : bool,
        depart_user : depart_user,
        arrive_user : arrive_user,
        depart_chauffeur : depart_chauffeur,
        arrive_chauffeur : arrive_chauffeur
    };
}

export async function addressToCoordinate(adresse) {

    return geocoder.geocode(adresse)
            .then( (res) => {

                return {
                    lat: res[0].latitude,
                    lng: res[0].longitude
                };
            })
            .catch( (error) => {
                console.log('Adress to coordinates error : ' + error);
            });
}     

async function distanceBetweenAdress(coords_user, coords_chauffeur) {

    try {
        
        let distance = geo.headingDistanceTo(coords_user, coords_chauffeur);
        let isDistanceGood = false;

        if (distance.distance <= 1000 ) {
            isDistanceGood = true;
        }

        return isDistanceGood;

    } catch (error) {
        console.log('distance between adress error : ' + error);
    }
}