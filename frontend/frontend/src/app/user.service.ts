import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  registerUser(nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

    console.log(nom, prenom, email, numero, typeUser, mdp);
    return this.http.post < any > ('http://localhost:9500/register', {
      nom : '' + nom,
      prenom: '' + prenom,
      email: '' + email,
      numero: '' + numero,
      typeUser: '' + typeUser,
      motDePasse: '' + mdp
    });

  }

  getUsersData() {

    return this.http.get <any>('http://localhost:9500/data/getData');
  }

  updateUser(id: any, nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

  console.log(id, nom, prenom, email, numero, typeUser, mdp);
  return this.http.post<any>('http://localhost:9500/data/updateData', {
    id,
    nom : '' + nom,
    prenom: '' + prenom,
    email: '' + email,
    numero: '' + numero,
    typeUser: '' + typeUser,
    motDePasse: '' + mdp
  });
  }

  deleteUser(id: any) {

    return this.http.post('http://localhost:9500/data/deleteData', {
      id
    });
  }


  // verif valide le mot de passe et le mail entrés
  verif(email, password, confirmPassword) {

    let errors = [];

    if (password !== confirmPassword) {
        errors = [];
        errors.push('Vos deux mots de passe ne sont pas identiques');
    // tslint:disable-next-line: max-line-length
    } else if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        errors = [];
        errors.push('Email invalide');
    } else {
        errors = [];
    }

    return errors;
  }

}
