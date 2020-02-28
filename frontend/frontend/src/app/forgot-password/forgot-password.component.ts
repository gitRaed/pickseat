import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../db.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private route: ActivatedRoute, private db: DbService, private user: UserService, private router: Router) { }

  message;
  emailValue;
  link =  'http://localhost:4200';
  ngOnInit() {
    this.emailValue = this.route.snapshot.paramMap.get('email');
  }

  modifMdp(event) {

    event.preventDefault();
    const target = event.target;
    const email = target.querySelector('#email_user').value;
    const password = target.querySelector('#mdp_user').value;
    const confirmPassword = target.querySelector('#confirm_mdp_user').value;


    this.user.appelUnicite(email, 'mdp', 'register').subscribe( (result) => {

      if (result.auth) {

          this.message = this.user.verif(password, confirmPassword, false);
          if (this.message.length === 0 ) {

            this.message = 'Mot de passe modifié! Vous allez être renvoyé à la page d\'authentification';
            this.db.resetPassword(email, password).subscribe();
            this.navigate();
            }
      } else {
        this.message = 'Email inexistant. \n Vous allez être renvoyé à la page d\'authentification';
        this.navigate();
      }
    });

    }


    navigate() {

      setInterval(() => {
        this.router.navigate(['']);
      }, 4000);
      }
    }
