import {
  Component,
  OnInit
} from '@angular/core';
import { UserService } from '../user.service';



@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  message = '';

  constructor(private user: UserService) {}


  ngOnInit() {}

  register(event) {
    event.preventDefault();
    const target = event.target;
    const nom = target.querySelector('#nom_user').value;
    const prenom = target.querySelector('#prenom_user').value;
    const email = target.querySelector('#email_user').value;
    const numero = target.querySelector('#numero_user').value;
    const typeUser = target.querySelector('#type_user').value;
    const password = target.querySelector('#mdp_user').value;
    const confirmPassword = target.querySelector('#confirm_mdp_user').value;

    const verif = this.user.verif(email, password, confirmPassword);

    if (verif.length === 0) {
      this.message = 'Valider votre compte en cliquant sur le lien envoyé dans votre boîte de réception email';
      this.user.registerUser(nom, prenom, email, numero, typeUser, password).subscribe(() => {
        console.log('Data sent ');
      });
    }

  }

}
