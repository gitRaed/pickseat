import {
    getTrajetDate,
    deleteTrajetDate,
    getDemandeDate,
    deleteDemande
} from '../../dataAccessLayer/requete_map.mjs';

export async function compareTrajet(email) {

    // * cette fonction s'occupe de vérifier si un des trajets de l'utilisateur est périmé, et change la valeur de validité à 1 si c'est le cas

    const listeTrajet = await getTrajetDate(email); // * liste des dates des trajets de l'utilisateur ordonnée par rapport à la date

    const today_date = new Date(); // * new Date() sans valeur en paramètre déclare la date de today

    for (let i = 0, n = listeTrajet.length; i < n ; i++) {

        const date_trajet = new Date(listeTrajet[i].date_trajet);

        const comparaisonSuperieurDate = today_date > date_trajet; // * égale true si la date est plus ancienne que celle de today

        if(comparaisonSuperieurDate === true) {

            const testDate = await deleteTrajetDate(date_trajet);
            console.log('Liste des trajets à supprimer : ' );
            console.log(testDate);

        }
    }
    
    return true;

}


export async function compareDemande() {

    // * cette fonction s'occupe de vérifier si une des demandes est périmée, et change la valeur de validité à 1 si c'est le cas

    const listeDemandes = await getDemandeDate(); // * liste des dates des demandes par rapport à la date

    const today_date = new Date(); // * new Date() sans valeur en paramètre déclare la date de today

    for (let i = 0, n = listeDemandes.length; i < n ; i++) {

        const date_trajet = new Date(listeDemandes[i].date_trajet);

        const comparaisonSuperieurDate = today_date > date_trajet; // * égale true si la date est plus ancienne que celle de today

        if(comparaisonSuperieurDate === true) {

            const testDate = await deleteDemande(date_trajet);
            console.log('Liste des demandes à supprimer : ' );
            console.log(testDate);

        }
    }
    
}