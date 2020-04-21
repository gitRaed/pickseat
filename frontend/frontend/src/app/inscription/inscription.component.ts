import {
  Component,
  OnInit
} from '@angular/core';
import { UserService } from '../user.service';
import { DbService } from '../db.service';



@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  message: string;

  constructor(private user: UserService, private db: DbService) {}


  ngOnInit() {}

  register(event) {

    event.preventDefault();
    const target = event.target;

    const data = {
      nom : target.querySelector('#nom_user').value,
      prenom: target.querySelector('#prenom_user').value,
      email: target.querySelector('#email_user').value,
      numero: target.querySelector('#numero_user').value,
      typeUser: target.querySelector('#type_user').value,
      password: target.querySelector('#mdp_user').value,
      confirmPassword: target.querySelector('#confirm_mdp_user').value
    };

    this.user.appelUnicite(data.email, data.password, 'register').subscribe( (result) => {

      const verif = this.user.verif(data.password, data.confirmPassword, result.auth);
      this.message = this.user.test(data, verif, 'register');

      if (this.message === 'Valider votre compte en cliquant sur le lien envoyé dans votre mail') {
        this.db.registerUser(data.nom, data.prenom, data.email, data.numero, data.typeUser, data.password).subscribe();
      }
    });

  }

}
