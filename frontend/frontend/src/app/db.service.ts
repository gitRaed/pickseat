import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient, private auth: AuthService) {}


  //#region users
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


  getUsersData(email: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post <any>('http://localhost:9500/data/getData', {
      email
    }, optionsHeader);
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
  //#endregion


  //#region options users
  banUser(email: string, id: any, nom: string, prenom: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post('http://localhost:9500/data/ban', {
      email, // * pour la vérification
      id,
      nom,
      prenom
    }, optionsHeader);
  }

  suspendUser(email: string, id: any, nom: string, prenom: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post('http://localhost:9500/data/suspend', {
      email, // * pour la vérification
      id,
      nom,
      prenom
    }, optionsHeader);
  }

  normalUser(email: string, id: any, nom: string, prenom: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };
    return this.http.post('http://localhost:9500/data/normal', {
      email, // * pour la vérification
      id,
      nom,
      prenom
    }, optionsHeader);
  }

  updateUser(emailVerif: string, id: any, nom: string, prenom: string, email: string, numero: string, typeUser: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/data/updateData', {
      emailVerif, // * pour la vérification
      id,
      nom : '' + nom,
      prenom: '' + prenom,
      email: '' + email,
      numero: '' + numero,
      typeUser: '' + typeUser
    }, optionsHeader);
  }

  deleteUser(email: string, id: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post('http://localhost:9500/data/deleteData', {
      email, // * pour la vérification
      id
    }, optionsHeader);
  }

  //#endregion


  // *Pour le contactUs
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

  sendPointImportant(email: string, message: string, latitude: number, longitude: number, sonner: string) {

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
      longitude,
      sonner
    }, options);
  }

  updatePointImportant(id, email, message: string, sonner: string) {

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
      message,
      sonner
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
      id,
      email : this.auth.getData().email
    }, options);
  }

  alarme(email, latitude, longitude) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const options = {
      headers,
      observable : 'response',
  };

    return this.http.post<any>('http://localhost:9500/map/alarme', {
      email,
      latitude,
      longitude
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
  enregistrerTrajet(nom,
                    prenom,
                    email,
                    numero,
                    adresseDepart,
                    adresseArrive,
                    heureTrajet,
                    dateTrajet,
                    options,
                    escale,
                    tarifTotal,
                    tarifEscale) {

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
      escale,
      tarifTotal,
      tarifEscale
    }, optionsHeader);
  }

  modifierTrajet(id,
                 email,
                 adresseDepart,
                 adresseArrive,
                 heureTrajet,
                 dateTrajet,
                 options,
                 escale,
                 tarifTotal,
                 tarifEscale) {

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
      escale,
      tarifTotal,
      tarifEscale
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


  //#region demandes
  enregisterDemande(emailChauffeur, emailVoyageur, adresseDepart, adresseArrive, dateTrajet, heureTrajet, tarif) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/registerDemande', {
      emailChauffeur,
      emailVoyageur,
      adresseDepart,
      adresseArrive,
      dateTrajet,
      heureTrajet,
      tarif
    }, optionsHeader);
  }

  getDemandeUser(email, typeUser) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/getDemandeUser', {
      email,
      typeUser
    }, optionsHeader);
  }

  getDemande(email) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/getDemande', {
      email
    }, optionsHeader);
  }

  updateDemande(email, id, status) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/updateDemande', {
      email,
      id,
      status
    }, optionsHeader);
  }
  //#endregion


  //#region notifications

  notification(email, typeUser) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization : 'Bearer ' + this.auth.getData().token,
    });

    const optionsHeader = {
      headers,
      observable : 'response',
    };

    return this.http.post<any>('http://localhost:9500/map/notifications', {
      email,
      typeUser
    }, optionsHeader);
  }
  //#endregion
}
