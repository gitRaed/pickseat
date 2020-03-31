import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';
import { DbService } from '../db.service';
import { MapService } from '../map.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit, OnDestroy {

  constructor(private mapService: MapService,
              private db: DbService,
              private modalService: NgbModal,
              private user: UserService,
              private auth: AuthService,
              private router: Router) {}

  message = 'Merci d\'utiliser Pickseat !';
  private pointImportant = false;
  private itineraire = false;
  private routing = null;
  private covoiturage = false;
  private boutonStartEnd = false;
  private boutonSonner = false;
  usersData = {};
  trajet = [];
  isTrajet = false;
  private coordonnees = {
    lat: 0,
    lng: 0
  };
  map: L.Map;


  ngOnInit(): void {

    this.locateUser(true);

    // *pour récupérer la position de l'utilisateur toutes les 10 secondes
    setInterval(() => {
      this.locateUser(false);
      this.onBoutonSonner();
    }, 10000);

    // *afficher les points importants
    this.mapService.getPointImportant();

    // *récupérer les données de l'utilisateur
    this.usersData = this.auth.getData();
    console.log(this.usersData);

  }

  createButton(label, container) {

    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    btn.style.backgroundColor = 'white';
    btn.style.border = 'none';
    btn.style.boxShadow = ' 0 0 2px #222f3e';
    btn.style.color = '#222f3e';
    return btn;
  }

  locateUser(bol) {

     // trouver la localisation de l'utilisateur
    navigator.geolocation.getCurrentPosition((position) => {

      // si l'user accepte de donner sa position
      if (bol === true ) {
        this.mapService.setOptions(15, position.coords.latitude, position.coords.longitude);
      }
      this.mapService.setLayersControl('Your position', position.coords.latitude, position.coords.longitude,
          'This is where you are ' + this.auth.getData().nom + ' ' + this.auth.getData().prenom);
      this.mapService.setCoordone(position.coords.latitude, position.coords.longitude);
    }, () => {
      // s'il n'accepte pas
      console.log('Uh.. ok, i will still find your location even if it is not accurate');
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(result => {

          if (bol === true) {
            this.mapService.setOptions(15, result.latitude, result.longitude);
          }

          this.mapService.setLayersControl('Your position', result.latitude, result.longitude, 'Approximation of your position');
        });
    });
  }



  //#region mapFunction
  onMapReady(map: L.Map) {

    this.map = map;

    // option rechercher
    this.searchAddress();

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  mapOptions() {

    return this.mapService.getOptions();
  }

  mapLayersControl() {

    return this.mapService.getLayersControl();
  }

  recupCoordonnees(event) {

    this.coordonnees.lat = event.latlng.lat;
    this.coordonnees.lng = event.latlng.lng;
  }

  searchAddress() {

    const provider = new OpenStreetMapProvider();
    new GeoSearchControl({
      provider,
      searchLabel: 'Entrer une addresse',
      style: 'bar',
      classNames: {

      }
    }).addTo(this.map);

  }

  findItineraire() {

    // *marche malgré les erreurs
    // TODO: trouver pourquoi il y'a 2 erreurs ici
    this.routing = L.Routing.control({
      geocoder: L.Control.Geocoder.nominatim(),
      router: L.Routing.mapbox('pk.eyJ1Ijoib3JmZXIiLCJhIjoiY2s4OXk3NngwMGF3ZTNpbXBhaTM1NTBhYiJ9.HzQ7as1fZfYpzZSLRFvY7Q'),
      lineOptions: {
        styles: [{
          color: '#00a8ff',
          opacity: 1,
          weight: 5,
        }]
      },
    }).addTo(this.map);

  }

  removeItineraire() {

    this.map.removeControl(this.routing);
  }

  //#endregion

  //#region options
  modal(content: any) {

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    });
  }
  contactUs(event) {

    this.message = 'Merci d\'utiliser Pickseat !';
    event.preventDefault();
    const target = event.target;

    const data = {
      email: target.querySelector('#email_user_contactUs').value,
      message: target.querySelector('#message_user_contactUs').value,
    };

    // verifier si le token existe
    if (this.auth.getData().token !== null) {
      this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe((result) => {

        // verifier si l'email est disponible
        // result = true si l'email existe
        if (result.auth === true) {

          this.message = 'Message envoyé !';
          this.db.sendMessage(data.email, data.message).subscribe((resSendMessage) => {
            this.message = resSendMessage.message;
          });
        } else {

          this.message = 'Email non existant';
        }
      });

    } else {

      this.message = 'Vous devez vous connectez ';
    }

  }

  redirectionProfil() {

    this.router.navigate(['/gerer-users']);
  }
  //#endregion

  //#region pointImportant

  getPointImportantStatus() {

    let status = 'Désactivé';

    if (this.pointImportant === true) {
      status = 'Activé';
    }

    return status;
  }

  getPointImportant() {
    return this.pointImportant;
  }

  setPointImportant() {

    this.pointImportant = !this.pointImportant;
  }

  enregistrerPointImportant(event) {

    this.message = 'Merci d\'utiliser Pickseat !';
    if (this.pointImportant === true) {

      event.preventDefault();
      const target = event.target;
      const data = {
        email: target.querySelector('#email_user_point_important').value,
        message: target.querySelector('#message_user_point_important').value,
        latitude: this.coordonnees.lat,
        longitude: this.coordonnees.lng,
        sonner : target.querySelector('#sonner').value
      };

      // verifier si le token existe
      if (this.auth.getData().token !== null) {
        // sil existe, verifier si lemail est disponible
        this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe((result) => {

          // result = true si email es disponible
          if (result.auth === true) {

            this.message = 'Point important enregistré !';
            this.db.sendPointImportant(data.email, data.message, data.latitude, data.longitude, data.sonner).subscribe((resSendMessage) => {
              this.message = resSendMessage.message;
              this.mapService.getPointImportant();
            });
          } else {

            this.message = 'Email non existant';
          }
        });

      } else {

        this.message = 'Vous devez vous connectez ';
      }
    }
  }

  redirectionGererPoint() {

    this.router.navigate(['gerer-point-important']);
  }
  //#endregion

  //#region itineraire
  getItineraire() {

    return this.itineraire;
  }

  setItineraire() {

    this.itineraire = !this.itineraire;

    if (this.itineraire) {

      this.findItineraire();

    } else {

      this.removeItineraire();
    }
  }

  onClickLocation(event) {

    if (this.boutonStartEnd === true) {

      const container = L.DomUtil.create('div');
      const startBtn = this.createButton('Start here?', container);
      const endBtn = this.createButton('End here?', container);

      L.popup()
      .setContent(container)
      .setLatLng(event.latlng)
      .openOn(this.map);

      L.DomEvent.on(startBtn, 'click', () => {

      this.routing.spliceWaypoints(0, 1, event.latlng);
      this.map.closePopup();
    });

      L.DomEvent.on(endBtn, 'click', () => {

      this.routing.spliceWaypoints(this.routing.getWaypoints().length - 1, 1, event.latlng);
      this.map.closePopup();
    });
    }
  }


  setBoutonStartEnd() {

    this.boutonStartEnd = !this.boutonStartEnd;
  }

  getBoutonStartEnd() {

    let status = 'Désactivé';

    if (this.boutonStartEnd === true) {
      status = 'Activé';
    }

    return status;
  }

  onBoutonSonner() {

    if (this.boutonSonner === true) {

      const coords = {
        latitude : this.mapService.getCoordonne().latitude,
        longitude : this.mapService.getCoordonne().longitude
      };

      this.db.alarme(this.auth.getData().email, 5.278210, -3.977520).subscribe((result) => {
        console.log('Result : ' + result.isDist);
        if (result.isDist === true) {
          console.log('Faire sonner');
          // *Vibre coomme l'intro de super mario
          navigator.vibrate([125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600]);
          window.alert('Vous êtes à proximité du point ' + result.libelle);
        }

      });
    }
  }

  setBoutonSonner() {

    this.boutonSonner = !this.boutonSonner;
  }

  getBoutonSonner() {

    let status = 'Désactivé';

    if (this.boutonSonner === true) {
      status = 'Activé';
    }

    return status;
  }

  afficherRoutes(depart, arrive) {

    this.itineraire = true;
    if (this.routing) {
      this.removeItineraire();
    }

    this.findItineraire();
    // this.route(departUser, arriveUser);
    this.routing.spliceWaypoints(0, 1, depart);
    this.routing.spliceWaypoints(this.routing.getWaypoints().length - 1, 1, arrive);
  }


  //#endregion

  //#region profil

  updateProfil(event) {

    event.preventDefault();
    const target = event.target;
    const data = {
      id: this.auth.getData().id,
      nom: target.querySelector('#nom_user').value,
      prenom: target.querySelector('#prenom_user').value,
      email: target.querySelector('#email_user').value,
      numero: target.querySelector('#numero_user').value,
      typeUser: target.querySelector('#type_user').value,
    };

    this.message = this.user.test(data, [], 'update');

    if (this.message === 'Utilisateur ' + data.nom + ' ' + data.prenom + ' modifié!') {
      this.db.updateUser(data.id, data.nom, data.prenom, data.email, data.numero, data.typeUser).subscribe(() => {
        console.log('Data Updated!');
        this.auth.setData(data.id, data.nom, data.prenom, data.email, data.numero, data.typeUser, this.auth.getData().token);
      });
    }
  }


  //#endregion

  //#region trajet

  registerTrajet(event) {

    this.message = 'Merci d\'utiliser Pickseat !';
    event.preventDefault();
    const target = event.target;
    const data = {
      nom: this.auth.getData().nom,
      prenom: this.auth.getData().prenom,
      email: this.auth.getData().email,
      numero: this.auth.getData().numero,
      adresse_depart: target.querySelector('#adresse_depart').value.toLowerCase(),
      adresse_arrive: target.querySelector('#adresse_arrive').value.toLowerCase(),
      heure_trajet: target.querySelector('#heure_trajet').value,
      date_trajet: target.querySelector('#date_trajet').value,
      options: target.querySelector('#options').value,
      escale: ''
    };

    // function anonyme qui s'exécute automatiquement
    (() => {
      const escaleValue = target.querySelector('#escale').value;
      if (data.options === 'oui') {
        data.escale = escaleValue;
      } else {
        data.escale = 'non';
      }
    })();

    // verifier si le token existe
    if (this.auth.getData().token !== null) {
      // sil existe, verifier si lemail est disponible
      // Pour respecter la structure du back, un password doit etre envoyé
      this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe((result) => {

        // result = true si email es disponible
        if (result.auth === true) {

          this.db.enregistrerTrajet(data.nom,
              data.prenom,
              data.email,
              data.numero,
              data.adresse_depart,
              data.adresse_arrive,
              data.heure_trajet,
              data.date_trajet,
              data.options,
              data.escale)
            .subscribe((Result) => {

              this.message = Result.message;
            });
        } else {

          this.message = 'Email non existant';
        }
      });

    } else {

      this.message = 'Vous devez vous connectez ';
    }
  }

  redirectionGestionTrajet() {

    this.router.navigate(['gerer-trajet']);
  }

  findTrajet(event) {

    this.trajet = [];
    this.isTrajet = false;
    event.preventDefault();
    const target = event.target;
    const data = {
      email: this.auth.getData().email,
      adresse_depart: target.querySelector('#adresse_depart').value.toLowerCase(),
      adresse_arrive: target.querySelector('#adresse_arrive').value.toLowerCase(),
    };

    if (this.getCovoiturage() === true) {
      this.message = 'Veuillez patientez...';

      // verifier si le token existe
      if (this.auth.getData().token !== null) {
        // sil existe, verifier si lemail est disponible
        // Pour respecter la structure du back, un password doit etre envoyé
        this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe((result) => {

          // result = true si email es disponible
          if (result.auth === true) {

            this.db.rechercherTrajet(data.email,
                data.adresse_depart,
                data.adresse_arrive)
              .subscribe((Result) => {

                if (Result.message === 'Pas de trajet similaire avec ses données') {
                  this.trajet.push({
                    message: Result.message
                  });
                } else {
                  this.isTrajet = true;
                  this.trajet = Result.message;
                  this.message = 'Chauffeurs trouvés!';
                }

              });
          } else {

            this.message = 'Email non existant';
          }
        });

      } else {

        this.message = 'Vous devez vous connectez ';
      }
    } else {
      this.message = 'Vous devez activer le covoiturage pour utiliser la recherche de trajet';
    }
  }
  //#endregion

  //#region covoiturage
  getCovoiturage() {
    return this.covoiturage;
  }

  getCovoiturageStatus() {
    let status = '';

    if (this.covoiturage === true) {
      status = 'Covoiturage activé';
    } else {
      status = 'Covoiturage désactivé';
    }

    return status;
  }

  setCovoiturage() {
    this.covoiturage = !this.covoiturage;
  }
  //#endregion



  ngOnDestroy() {

    this.map.remove();
  }
}
