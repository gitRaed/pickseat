import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MapService } from '../map.service';
import { DbService } from '../db.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements  OnInit, OnDestroy {

  constructor(private mapService: MapService,
              private db: DbService,
              private modalService: NgbModal,
              private user: UserService,
              private auth: AuthService,
              private router: Router) { }

  message = 'Merci d\'utiliser Pickseat !';
  private pointImportant = false;
  private itineraire = false;
  private routing = null;
  private coordonnees = {
    lat : 0,
    lng : 0
  };
  map: L.Map;


  ngOnInit(): void {

    // trouver la localisation de l'utilisateur
    navigator.geolocation.getCurrentPosition( (position) => {

      // si l'user accepte de donner sa position
      this.mapService.setOptions(15, position.coords.latitude, position.coords.longitude);
      this.mapService.setLayersControl('Your position', position.coords.latitude, position.coords.longitude,
                                      'This is where you are ' + this.auth.getData().nom + ' ' + this.auth.getData().prenom);
      this.mapService.setCoordone(position.coords.latitude, position.coords.longitude);
    }, () => {
      // s'il n'accepte pas
      console.log('Uh.. ok, i will still find your location even if it is not accurate');
      fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(result => {
        this.mapService.setOptions(15, result.latitude, result.longitude);
        this.mapService.setLayersControl('Your position', result.latitude, result.longitude, 'Approximation of your position');
      });
    });

    // afficher les points importants
    this.mapService.getPointImportant();
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
    const searchControl = new GeoSearchControl({
      provider,
      searchLabel: 'Entrer une addresse',
      style: 'bar',
      classNames : {

      }
    }).addTo(this.map);


  }

  findItineraire() {

      // marche malgré l'erreur
      this.routing = L.Routing.control({
        geocoder: L.Control.Geocoder.nominatim(),
        lineOptions: {
          styles: [{
            color: '#48dbfb',
            weight: 7
          }]
        },
      }).addTo(this.map);

  }

  removeItineraire() {
    this.map.removeControl(this.routing);
  }

  //#endregion

  //#region options
  modal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
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
      this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe( (result) => {

        // verifier si l'email est disponible
        // result = true si l'email existe
        if (result.auth === true) {

          this.message = 'Message envoyé !';
          this.db.sendMessage(data.email, data.message).subscribe((resSendMessage) => {
            this.message = resSendMessage.message;
          } );
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

  setItineraire() {

    this.itineraire = !this.itineraire;

    if (this.itineraire) {

      this.findItineraire();
    } else {

      this.removeItineraire();
    }
  }
  //#endregion

  //#region pointImportant

  getPointImportant() {
    return this.pointImportant;
  }

  setPointImportant() {

    this.pointImportant = !this.pointImportant;
    console.log('Point important : ' + this.pointImportant);
  }

  enregistrerPointImportant(event) {

    this.message = 'Merci d\'utiliser Pickseat !';
    if (this.pointImportant === true) {

      event.preventDefault();
      const target = event.target;
      const data = {
        email : target.querySelector('#email_user_point_important').value,
        message: target.querySelector('#message_user_point_important').value,
        latitude : this.coordonnees.lat,
        longitude : this.coordonnees.lng,
      };

      // verifier si le token existe
      if (this.auth.getData().token !== null) {
        // sil existe, verifier si lemail est disponible
        this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe( (result) => {

            // result = true si email es disponible
            if (result.auth === true) {

              this.message = 'Point important enregistré !';
              this.db.sendPointImportant(data.email, data.message, data.latitude, data.longitude).subscribe((resSendMessage) => {
                this.message = resSendMessage.message;
                this.mapService.getPointImportant();
              } );
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


  ngOnDestroy() {

    this.map.remove();
  }
}
