import { Injectable } from '@angular/core';
import { TranslationWidth } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private logStatus = false;
  private data = {
    nom : '',
    prenom : '',
    email : '',
    token: ''
  };

  getLogStatus(): boolean {
    return this.logStatus;
  }

  setLogStatus(value: boolean) {
    this.logStatus = value;
  }

  setData(nom, prenom, email, token) {
    this.data.nom = nom;
    this.data.prenom = prenom;
    this.data.email = email;
    this.data.token = token;
  }

  getData() {
    return this.data;
  }

}
