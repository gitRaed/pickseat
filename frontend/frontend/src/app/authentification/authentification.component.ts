import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DbService } from '../db.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  constructor(private user: UserService,
              private modalService: NgbModal,
              private auth: AuthService,
              private router: Router,
              private db: DbService) { }


  message = '';
  messageResetPassword = '';


  ngOnInit() {

    this.auth.setLogStatus(false);
  }

  modal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  authentification(event) {

    event.preventDefault();
    const target = event.target;

    const data = {
      email: target.querySelector('#email_user').value,
      password: target.querySelector('#mdp_user').value
    };

    this.user.appelUnicite(data.email, data.password, 'auth').subscribe( (result) => {

      if (result.auth === true) {
        this.auth.setData(result.id, result.nom, result.prenom, result.email, result.numero, result.typeUser, result.token);
        this.auth.setLogStatus(true);
        this.router.navigate(['/map']);
      } else {
        this.message = 'Email ou mot de passe non existant';
      }
    });
  }

  mdpForgot(event) {

    event.preventDefault();
    const target = event.target;
    const email = target.querySelector('#email_user').value;


    this.user.appelUnicite(email, 'mdp', 'register').subscribe( (result) => {

      if (result.auth) {
        this.db.sendMailResetPassword(email).subscribe();
        this.messageResetPassword = 'Message envoyé dans votre boîte mail, suivez les instructions ! ';
      } else {
        this.messageResetPassword = 'Email inexistant';
      }
    });

  }

}
