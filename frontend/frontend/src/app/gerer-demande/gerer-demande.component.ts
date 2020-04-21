import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-gerer-demande',
  templateUrl: './gerer-demande.component.html',
  styleUrls: ['./gerer-demande.component.css']
})
export class GererDemandeComponent implements OnInit {

  constructor(private db: DbService,
              private auth: AuthService) {}


  message = '';
  demandes = [];

  ngOnInit() {

    this.getDemande();
  }

  getDemande() {

    this.db.getDemande(this.auth.getData().email).subscribe( (result) => {

      if (result.message === 'Pas de demandes') {
        this.message = result.message;
      } else {

        this.demandes = result.message[0];
      }
    });
  }
}
