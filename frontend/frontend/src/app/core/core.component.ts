import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

declare const L: any;
import { icon, Marker } from 'leaflet';
import 'leaflet/dist/images/marker-icon.png';
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

  private coordonnees = { lat: 0, lng: 0};
  private pointImportant = false;
  private itineraire = false;
  private routing = null;
  private covoiturage = false;
  private boutonStartEnd = false;
  private boutonSonner = false;

  message = 'Merci d\'utiliser Pickseat !';
  usersData = { nom: '', prenom: '', email: '', numero: '', typeUser: '',
                statusValidation : '', statusCompte : '',
                superAdmin : false, admin : false };
  trajet = [];
  demandes = [];
  libelle = '';
  notifLength = 0;
  isTrajet = false;
  map: L.Map;


  ngOnInit() {

    this.locateUser(true);

    // *pour récupérer la position de l'utilisateur et notifier l'utilisateur toutes les 10 secondes

    setInterval(() => {
      this.onBoutonSonner(); // * notifie l'utilisateur s'il est proche d'un de ses points important
      this.getNotificationLength(); // *elle notifie l'utilisateur s'il a une demande en attente/demande acceptée
    }, 10000);

    // *afficher les points importants
    this.mapService.getPointImportant();

    // *récupérer les données de l'utilisateur
    this.usersData = this.auth.getData();

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
      marker: {
        icon: new L.icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        })
      }
      }).addTo(this.map);
  }

  findItineraire() {

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

    // * cette fonction permet d'afficher l'aide de remplissage rapide des routes à l'appui du bouton "git"
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

      this.locateUser(false);
      const coords = {
        latitude : this.mapService.getCoordonne().latitude,
        longitude : this.mapService.getCoordonne().longitude
      };

      this.db.alarme(this.auth.getData().email, coords.latitude, coords.longitude).subscribe((result) => {

        if (result.isDist === true && this.libelle !== result.libelle) {

          this.libelle = result.libelle;

          const notification = new Notification('Pickseat', {
            body: 'Vous êtes à proximité du point ' + result.libelle,
            icon: '../assets/img/favicon.png',
            vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600]
              // *Vibre coomme l'intro de super mario
          });
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

      const email = this.auth.getData().email;
      this.db.updateUser(email, data.id, data.nom, data.prenom, data.email, data.numero, data.typeUser).subscribe(() => {

        this.auth.setData(data.id, data.nom, data.prenom, data.email, data.numero, data.typeUser,
                          this.auth.getData().statusValidation, this.auth.getData().statusCompte,
                          this.auth.getData().token, this.auth.getData().admin, this.auth.getData().superAdmin);
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
      escale: '',
      tarif_total: target.querySelector('#tarif_total').value,
      tarif_escale : ''
    };

    // *fonction anonyme qui check les valeurs de escale et tarif escale
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
              data.escale,
              data.tarif_total,
              data.tarif_escale)
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

    let status = 'Désactivé';

    if (this.covoiturage === true) {
      status = 'Activé';
    }

    return status;
  }

  setCovoiturage() {

    this.covoiturage = !this.covoiturage;
  }
  //#endregion


  //#region demandes
  registerDemande(emailChauffeur, adresseDepart, adresseArrive, dateTrajet, heureTrajet, tarif) {

    const typeUser = this.auth.getData().typeUser;
    const emailVoyageur = this.auth.getData().email;
    // *emailvoyageur = email utilisateur car user est sensé être le voyageur vu qu'il nya que lui qui peut enregister une demande

    if (typeUser !== 'voyageur') {

      this.message = 'Vous ne pouvez pas faire de demande!';

    } else {

         // verifier si le token existe
        if (this.auth.getData().token !== null) {

        // Pour respecter la structure du back, un password doit etre envoyé
          this.user.appelUnicite(emailVoyageur, 'somePassword', 'register').subscribe((result) => {

            // result = true si email es disponible
            if (result.auth === true) {

              this.db.enregisterDemande(emailChauffeur, emailVoyageur, adresseDepart, adresseArrive, dateTrajet, heureTrajet, tarif)
                  .subscribe( (resultat) => {
                    this.message = resultat.message;
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

  redirectionDemande() {

    this.router.navigate(['gerer-demandes']);
  }

  redirectionDemandeUser() {

    this.router.navigate(['gerer-demandes-user']);
  }

  //#endregion


  //#region notifications


  getNotificationLength() {

    // * retourne le nombre de demandes:
    // * accepter, pour un voyageur
    // * en attente pour un chauffeur

    this.db.notification(this.usersData.email, this.usersData.typeUser).subscribe( (result) => {

      if (this.notifLength !== result.length) {

        this.notifLength = result.length;
        this.showNotification();
      }

    });

  }

  async showNotification() {

    const permission = await Notification.requestPermission();

    if (this.usersData.typeUser === 'chauffeur') {

      const notification = new Notification('Pickseat', {
        body: 'Vous avez ' + this.notifLength + ' demandes en attente',
        icon: '../assets/img/favicon.png',
        vibrate: [150, 50, 150]
      });

    } else if (this.usersData.typeUser === 'voyageur') {

      const notification = new Notification('Pickseat', {
        body: 'Vous avez ' + this.notifLength + ' demandes acceptées',
        icon: '../assets/img/favicon.png',
        vibrate: [150, 50, 150]
      });
    }
  }


  //#endregion


  //#region droits

  isChauffeur() {

    let status = false;

    if (this.usersData.typeUser === 'chauffeur' && this.usersData.statusCompte === 'Actif' || this.usersData.superAdmin === true) {

      status = true;
    }

    return status;
  }

  isVoyageur() {

    let status = false;

    if (this.usersData.typeUser === 'voyageur' && this.usersData.statusCompte === 'Actif' || this.usersData.superAdmin === true) {

      status = true;
    }

    return status;
  }

  isAdmin() {

    let status = false;

    if (this.usersData.admin === true || this.usersData.superAdmin === true) {

      status = true;
    }

    return status;
  }

  checkStatus() {

    let status = false;

    if (this.usersData.statusCompte === 'Actif') {

      status = true;
    }

    return status;
  }
  //#endregion


  ngOnDestroy() {

    this.map.remove();
  }


}
