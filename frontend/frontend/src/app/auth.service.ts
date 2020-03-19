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
    numero : '',
    typeUser : '',
    token: ''
  };

  getLogStatus(): boolean {
    return this.logStatus;
  }

  setLogStatus(value: boolean) {
    this.logStatus = value;
  }

  setData(nom: string, prenom: string, email: string, numero: string, typeUser: string, token: string) {
    this.data.nom = nom;
    this.data.prenom = prenom;
    this.data.email = email;
    this.data.numero = numero;
    this.data.typeUser = typeUser;
    this.data.token = token;

    console.log(this.data.token);
  }

  getData() {
    return this.data;
  }

}
