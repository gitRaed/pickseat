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
    this.getData();
  }

  delete(id, nom, prenom) {

    this.db.deleteUser(id).subscribe(() => {
      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !';
      console.log('User deleted !');
      this.getData();
    });
  }


  getData() {
    this.db.getUsersData().subscribe( (result) => {
      this.data = result;
    });
  }
}
