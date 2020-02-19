import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-gerer-users',
  templateUrl: './gerer-users.component.html',
  styleUrls: ['./gerer-users.component.css']
})


export class GererUsersComponent implements OnInit {

  constructor(private user: UserService, private modalService: NgbModal) { }

  data = [];
  message = '';

  ngOnInit() {
    this.getData();
  }


  modal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  update(event) {
    event.preventDefault();
    const target = event.target;
    const id = target.querySelector('#id_user').value;
    const nom = target.querySelector('#nom_user').value;
    const prenom = target.querySelector('#prenom_user').value;
    const email = target.querySelector('#email_user').value;
    const numero = target.querySelector('#numero_user').value;
    const typeUser = target.querySelector('#type_user').value;
    const password = target.querySelector('#mdp_user').value;
    const confirmPassword = target.querySelector('#confirm_mdp_user').value;

    const verif = this.user.verif(email, password, confirmPassword);

    if (verif.length === 0) {
      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' modifié!';
      console.log('Data envoyées : \n', nom, prenom, email, numero, typeUser, password);
      this.user.updateUser(id, nom, prenom, email, numero, typeUser, password).subscribe(() => {
        console.log('Data Updated! ');
        this.getData();
      });
    }

  }

  delete(id, nom, prenom) {

    this.user.deleteUser(id).subscribe(() => {
      this.message = 'Utilisateur ' + nom + ' ' + prenom + ' supprimé !';
      console.log('User deleted !');
      this.getData();
    });
  }

 

  getData() {
    this.user.getUsersData().subscribe( (result) => {
      this.data = result;
    });
  }
}
