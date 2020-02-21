import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) {}

  registerUser(nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

    console.log('You\'ve been registered!');
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

  authUser(email: string, motDePasse: string) {

    return this.http.post < any >('http://localhost:9500/data/auth', {
      email,
      motDePasse
    });
  }

  banUser(id: any, nom: string, prenom: string) {

    return this.http.post('http://localhost:9500/data/ban', {
      id,
      nom,
      prenom
    });
  }

  suspendUser(id: any, nom: string, prenom: string) {

    return this.http.post('http://localhost:9500/data/suspend', {
      id,
      nom,
      prenom
    });
  }

  normalUser(id: any, nom: string, prenom: string) {

    return this.http.post('http://localhost:9500/data/normal', {
      id,
      nom,
      prenom
    });
  }

  updateUser(id: any, nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

    console.log('Update user : ' + id, nom, prenom, email, numero, typeUser, mdp);
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
}
