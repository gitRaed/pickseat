import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) {}
  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    observable : 'response'
};

  
  registerUser(nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

    return this.http.post < any > ('http://localhost:9500/register', {
      nom : '' + nom,
      prenom: '' + prenom,
      email: '' + email,
      numero: '' + numero,
      typeUser: '' + typeUser,
      motDePasse: '' + mdp
    });

  }

  //#region  db
  getUsersData() {

    return this.http.get <any>('http://localhost:9500/data/getData');
  }

  unicite(email: string, motDePasse: string, type: string) {

    return this.http.get<any>('http://localhost:9500/data/auth/' + email + '/' + motDePasse + '/' + type);
  }

  sendMailResetPassword(email) {

    return this.http.post('http://localhost:9500/register/forgotPassword', {
      email
    });
  }

  resetPassword(email, motDePasse) {

    return this.http.post('http://localhost:9500/register/resetPassword', {
      email,
      motDePasse
    });
  }

  //#region options
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

  updateUser(id: any, nom: string, prenom: string, email: string, numero: string, typeUser: string) {

    console.log('Update user : ' + id, nom, prenom, email, numero, typeUser);
    return this.http.post<any>('http://localhost:9500/data/updateData', {
      id,
      nom : '' + nom,
      prenom: '' + prenom,
      email: '' + email,
      numero: '' + numero,
      typeUser: '' + typeUser
    });
  }

  deleteUser(id: any) {

    return this.http.post('http://localhost:9500/data/deleteData', {
      id
    });
  }

  //#endregion

  //#endregion

  //#region geojson
  getStatesShapes() {

    return this.http.get('../assets/data/gz_2010_us_outline_5m.json');
  }
  //#endregion


}
