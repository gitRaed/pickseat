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
    this.StatusHeader(); // * affiche ou non le header
  }

  modal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  StatusHeader() {

    const status = this.auth.getHeaderStatus();

    if (status === false) {

      this.auth.setHeaderStatus();
    }
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

        this.auth.setData(result.id, result.nom, result.prenom, result.email, result.numero, result.typeUser, 
                          result.statusValidation, result.statusCompte,
                          result.token, result.admin, result.superAdmin);

        this.auth.setLogStatus(true);
        this.auth.setHeaderStatus();
        this.checkStatusValidation(result.statusValidation);
        this.checkStatusCompte(result.statusCompte);

      } else {

        this.message = 'Email ou mot de passe non existant';
      }
    });
  }


  checkStatusCompte(status) {

    if (status === 'Banni') {

      this.router.navigate(['**']);

    } else {

      this.router.navigate(['/map']);
    }
  }

  checkStatusValidation(status) {

    if (status === 'Attente') {

      window.alert('Veuillez valider votre compte en cliquant le lien dans l\'email qu\'on vous a envoyé, ' +
                  'vous ne pourrez pas utiliser toutes les fonctionnalités de pickseat sinon!');
    }
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
