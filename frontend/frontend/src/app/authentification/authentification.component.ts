import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  constructor(private user: UserService) { }


  message = '';
  ngOnInit() {
  }


  authentification(event) {

    event.preventDefault();
    const target = event.target;

    const data = {
      email: target.querySelector('#email_user').value,
      password: target.querySelector('#mdp_user').value
    };

    this.user.appelUnicite(data.email, data.password).subscribe( (result) => {

      if (result === true) {
        this.message = 'Bienvenue';
      } else {
        this.message = 'Email ou mot de passe non existant';
      }
    });
  }
}
