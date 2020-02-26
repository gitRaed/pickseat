import {
  Injectable
} from '@angular/core';
import {
  DbService
} from './db.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private db: DbService) {}


  // renvoie true si le mot de passe et l'email sont indisponibles
  appelUnicite(email, password) {

    return this.db.unicite(email, password);
  }

    // verif valide le mot de passe et le mail entrés
  verif(email, password, confirmPassword, auth) {

    let errors = [];

    console.log('auth : ' + auth);

    if (password !== confirmPassword) {
        errors = [];
        errors.push('Vos deux mots de passe ne sont pas identiques');
    } else if (auth === true ) {
        errors = [];
        errors.push('Email ou mot de passe déjà disponible');
    } else {
        errors = [];
    }

    return errors;

    }

    // attribue le message de retour
  test(objet, errors,  type) {

    let message;
    if (errors.length === 0 && type === 'register') {

      message = 'Valider votre compte en cliquant sur le lien envoyé dans votre mail';

    } else if (errors.length === 0 && type === 'update') {

        message = 'Utilisateur ' + objet.nom + ' ' + objet.prenom + ' modifié!';

    } else {

      message = errors;
    }

    return message;

  }

}
