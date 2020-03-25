import nodeGeocoder from 'node-geocoder';
import * as geo from 'geolocation-utils';

let options = {
    provider: 'openstreetmap'
};

let geocoder = nodeGeocoder(options);

export async function distance(adresse_depart_user, adresse_depart_chauffeur) {

    let bool = false;
    const coords_user = await addressToCoordinate(adresse_depart_user);
    const coords_chauffeur = await addressToCoordinate(adresse_depart_chauffeur);

    
    const isDistanceGood = await distanceBetweenAdress(coords_user, coords_chauffeur);
    
    if (isDistanceGood === true) {
        bool = true;
    }

    return bool;
}

async function addressToCoordinate(adresse) {

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