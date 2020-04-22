import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private logStatus = false;
  private data = {
    id: 0,
    nom : '',
    prenom : '',
    email : '',
    numero : '',
    typeUser : '',
    statusValidation : '',
    statusCompte : '',
    token: '',
    admin: false,
    superAdmin: false
  };

  private headerStatus = true;



  getLogStatus(): boolean {

    return this.logStatus;
  }

  setLogStatus(value: boolean) {

    this.logStatus = value;
  }

  setData(id: number, nom: string, prenom: string, email: string, numero: string, typeUser: string,
          statusValidation: string, statusCompte: string,
          token: string, admin: boolean, superAdmin: boolean) {

    this.data.id = id;
    this.data.nom = nom;
    this.data.prenom = prenom;
    this.data.email = email;
    this.data.numero = numero;
    this.data.typeUser = typeUser;
    this.data.statusValidation = statusValidation;
    this.data.statusCompte = statusCompte;
    this.data.token = token;
    this.data.admin = admin;
    this.data.superAdmin = superAdmin;
  }

  getData() {

    return this.data;
  }

  getHeaderStatus() {

    return this.headerStatus;
  }

  setHeaderStatus() {

    this.headerStatus = !this.headerStatus;
    console.log(this.headerStatus);
  }

}
