import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DbService } from '../db.service';

@Component({
  selector: 'app-gerer-users',
  templateUrl: './gerer-users.component.html',
  styleUrls: ['./gerer-users.component.css']
})


export class GererUsersComponent implements OnInit {

  constructor(private user: UserService, private modalService: NgbModal, private db: DbService) { }

  data = [];
  message = '';

  ngOnInit() {
    this.getData();
  }


  modal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  update(event) {

    this.message = this.user.options('update', event);
    if (this.message.length > 0 ) {
      this.getData();
    }
  }

  delete(id, nom, prenom) {

    this.db.deleteUser(id).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !';
      console.log('User deleted !');
      this.getData();
    });
  }

  ban(id, nom, prenom) {

    this.db.banUser(id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' banni !';
      console.log('User banned!');
      this.getData();
    });
  }

  suspend(id, nom, prenom) {

    this.db.suspendUser(id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' suspendu !';
      console.log('User suspended!');
      this.getData();
    });
  }

  normal(id, nom, prenom) {

    this.db.normalUser(id, nom, prenom).subscribe(() => {

      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' est de retour !';
      console.log('User is back!');
      this.getData();
    });
  }


  getData() {
    this.db.getUsersData().subscribe( (result) => {
      this.data = result;
    });
  }
}
