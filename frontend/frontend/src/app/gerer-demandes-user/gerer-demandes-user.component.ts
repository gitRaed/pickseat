import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-gerer-demandes-user',
  templateUrl: './gerer-demandes-user.component.html',
  styleUrls: ['./gerer-demandes-user.component.css']
})
export class GererDemandesUserComponent implements OnInit {

  constructor(private db: DbService,
              private auth: AuthService) {}


  message = '';
  demandes = [];
  private email = this.auth.getData().email;
  private typeUser = this.auth.getData().typeUser;
  private isChauffeur = false;


  ngOnInit() {

    this.message = '';
    this.getDemandeUser();
    this.verifTypeUSer();
  }

  getDemandeUser() {

    this.db.getDemandeUser(this.email, this.typeUser).subscribe( (result) => {

      if (result.message === 'Pas de demandes') {

        this.message = result.message;

      } else {

        this.demandes = result.message[0];
        console.log(this.demandes);
      }
    });
  }

  verifTypeUSer() {

    this.isChauffeur = false;

    if (this.typeUser === 'chauffeur') {
      this.isChauffeur = true;
    }

  }

  getIsChauffeur() {
    return this.isChauffeur;
  }

  updateDemande(id, status) {

    this.db.updateDemande(this.email, id, status).subscribe( (result) => {

      this.message = result.message;
      this.getDemandeUser();
    });
  }

}
