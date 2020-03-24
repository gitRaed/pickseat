import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient, private auth: AuthService) {}


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


  getUsersData() {

    return this.http.get <any>('http://localhost:9500/data/getData');
  }


  unicite(email: string, motDePasse: string, type: string) {

    return this.http.get<any>('http://localhost:9500/data/auth/' + email + '/' + motDePasse + '/' + type);
  }

  sendMailResetPassword(email: any) {

    return this.http.post('http://localhost:9500/register/forgotPassword', {
      email
    });
  }

  resetPassword(email: any, motDePasse: any) {

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

  sendMessage(email: string, message: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post < any > ('http://localhost:9500/map/contactUs', {
      email,
      message
    }, options);
  }

  //#region pointImportant
  getPointImportant(email: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post <any>('http://localhost:9500/map/getPointImportant', {
      email
    }, options);
  }

  sendPointImportant(email: string, message: string, latitude: number, longitude: number) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post < any > ('http://localhost:9500/map/pointImportant', {
      email,
      message,
      latitude,
      longitude
    }, options);
  }

  updatePointImportant(id, email, message: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post< any > ('http://localhost:9500/map/updatePoint', {
      id,
      email,
      message
    }, options);
  }

  supprimerPointImportant(id) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post<any>('http://localhost:9500/map/deletePoint', {
      id
    }, options);
  }

  //#endregion

  //#region trajet

  getTrajet() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/getTrajet', {
      email: this.auth.getData().email
    }, optionsHeader);
  }
  enregistrerTrajet(nom, prenom, email, numero, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/enregistrerTrajet', {
      nom,
      prenom,
      email,
      numero,
      adresseDepart,
      adresseArrive,
      heureTrajet,
      dateTrajet,
      options,
      escale
    }, optionsHeader);
  }

  modifierTrajet(id, email, adresseDepart, adresseArrive, heureTrajet, dateTrajet, options, escale) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/updateTrajet', {
      id,
      email,
      adresseDepart,
      adresseArrive,
      heureTrajet,
      dateTrajet,
      options,
      escale
    }, optionsHeader);
  }

  supprimerTrajet(id, email) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/deleteTrajet', {
      id,
      email
    }, optionsHeader);
  }

  rechercherTrajet(email, adresseDepart, adresseArrive) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/rechercherTrajet', {
      email,
      adresseDepart,
      adresseArrive
    }, optionsHeader);
  }
  //#endregion

}
