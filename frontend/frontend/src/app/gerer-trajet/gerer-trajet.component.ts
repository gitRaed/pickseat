import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-gerer-trajet',
  templateUrl: './gerer-trajet.component.html',
  styleUrls: ['./gerer-trajet.component.css']
})
export class GererTrajetComponent implements OnInit {

  constructor(private db: DbService,
              private auth: AuthService,
              private user: UserService,
              private modalService: NgbModal) { }

  message = '';
  data = [];

  ngOnInit() {

    this.getTrajet();
  }

  modal(content: any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  getTrajet() {

    this.db.getTrajet().subscribe( (result) => {
      this.data = result.message;
    });
  }
  updateTrajet(event) {

    event.preventDefault();
    const target = event.target;
    const data = {
      id: target.querySelector('#id_trajet').value,
      email: this.auth.getData().email,
      adresse_depart: target.querySelector('#adresse_depart').value.toLowerCase(),
      adresse_arrive: target.querySelector('#adresse_arrive').value.toLowerCase(),
      heure_trajet: target.querySelector('#heure_trajet').value,
      date_trajet: target.querySelector('#date_trajet').value,
      options: target.querySelector('#options').value,
      escale: '',
      tarif_total: target.querySelector('#tarif_total').value,
      tarif_escale : ''
    };

    // function anonyme qui s'exécute automatiquement
    (() => {

      const escaleValue = target.querySelector('#escale').value;
      const tarifEscale = target.querySelector('#tarif_escale').value;

      if (data.options === 'oui') {

        data.escale = escaleValue;
        data.tarif_escale = tarifEscale;

      } else {
        data.escale = 'non';
        data.tarif_escale = 'Pas d\'escale';
      }
    })();

     // verifier si le token existe
    if (this.auth.getData().token !== null) {
      // sil existe, verifier si lemail est disponible
      // Pour respecter la structure du back, un password doit etre envoyé
      this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe( (result) => {

          // result = true si email es disponible
          if (result.auth === true) {

            this.db.modifierTrajet(data.id,
                                  data.email,
                                  data.adresse_depart,
                                  data.adresse_arrive,
                                  data.heure_trajet,
                                  data.date_trajet,
                                  data.options,
                                  data.escale,
                                  data.tarif_total,
                                  data.tarif_escale)
                .subscribe( (Result) => {

                  this.message = Result.message;
                  this.getTrajet();
                });
          } else {

            this.message = 'Email non existant';
          }
        });

    } else {

      this.message = 'Vous devez vous connectez ';
    }
  }

  deleteTrajet(id) {

    const email = this.auth.getData().email;
    this.db.supprimerTrajet(id, email).subscribe( (result) => {

      this.message = 'Trajet supprimé!';
      this.getTrajet();
    });
  }



}
