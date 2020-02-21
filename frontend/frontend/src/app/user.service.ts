import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private db: DbService) {}
  //#region variables
    id;
    nom;
    prenom;
    email;
    numero;
    typeUser;
    password;
    confirmPassword;
    target;
    message;
  //#endregion

  // verif valide le mot de passe et le mail entrés
  verif(email, password, confirmPassword) {

    let errors = [];
    // si email ou mdp existe déjà, auth = false
    if (password !== confirmPassword) {
        errors = [];
        errors.push('Vos deux mots de passe ne sont pas identiques');
      } else {
          errors = [];
      }

    return errors;
  }

  options(type, event) {

      event.preventDefault();
      this.target = event.target;
      this.nom = this.target.querySelector('#nom_user').value;
      this.prenom = this.target.querySelector('#prenom_user').value;
      this.email = this.target.querySelector('#email_user').value;
      this.numero = this.target.querySelector('#numero_user').value;
      this.typeUser = this.target.querySelector('#type_user').value;
      this.password = this.target.querySelector('#mdp_user').value;
      this.confirmPassword = this.target.querySelector('#confirm_mdp_user').value;

      const verif = this.verif(this.email, this.password, this.confirmPassword);

      if (verif.length > 0 ) {

          this.message = verif;

      } else if (verif.length === 0 && type === 'update') {

          this.id = this.target.querySelector('#id_user').value;

          console.log('Data envoyées : \n', this.nom, this.prenom, this.email, this.numero, this.typeUser, this.password);
          this.message = 'Utilisateur ' + this.nom + ' ' + this.prenom + ' modifié!';
          this.db.updateUser(this.id, this.nom, this.prenom, this.email, this.numero, this.typeUser, this.password).subscribe(() => {
            console.log('Data Updated! ');
          });

      } else if (verif.length === 0 && type === 'register') {

          this.message = 'Valider votre compte en cliquant sur le lien envoyé dans votre boîte de réception email';
          this.db.registerUser(this.nom, this.prenom, this.email, this.numero, this.typeUser, this.password).subscribe(() => {
            console.log('Data sent ');
          });
      }

      return this.message;
  }

}
