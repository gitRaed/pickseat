import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DbService } from '../db.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerer-users',
  templateUrl: './gerer-users.component.html',
  styleUrls: ['./gerer-users.component.css']
})


export class GererUsersComponent implements OnInit {

  constructor(private user: UserService,
              private auth: AuthService,
              private modalService: NgbModal,
              private db: DbService) { }

  data = [];
  message = '';
  private email = this.auth.getData().email;

  ngOnInit() {
    this.getData();
  }

  modal(content: any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  update(event) {

    event.preventDefault();
    const target = event.target;

    const data = {
      id: target.querySelector('#id_user').value,
      nom : target.querySelector('#nom_user').value,
      prenom: target.querySelector('#prenom_user').value,
      email: target.querySelector('#email_user').value,
      numero: target.querySelector('#numero_user').value,
      typeUser: target.querySelector('#type_user').value,
    };

    this.message = this.user.test(data, [], 'update');

    if (this.message === 'Utilisateur ' + data.nom + ' ' + data.prenom + ' modifié!') {

        const email = this.auth.getData().email;

        this.db.updateUser(email, data.id, data.nom, data.prenom, data.email, data.numero, data.typeUser).subscribe(() => {
          this.getData();
        });
      }

  }

  delete(id: any, nom: string, prenom: string) {

    this.db.deleteUser(this.email, id).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !';
      this.getData();
    });
  }

  ban(id: any, nom: string, prenom: string) {

    this.db.banUser(this.email, id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' banni !';
      this.getData();
    });
  }

  suspend(id: any, nom: string, prenom: string) {

    this.db.suspendUser(this.email, id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' suspendu !';
      this.getData();
    });
  }

  normal(id: any, nom: string, prenom: string) {

    this.db.normalUser(this.email, id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' est de retour !';
      this.getData();
    });
  }

  getData() {

    const email = this.auth.getData().email; // *envoie de l'email de l'utilisateur

    this.db.getUsersData(email).subscribe( (result) => {
      this.data = result;
    });
  }

}
