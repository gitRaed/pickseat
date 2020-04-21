import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from './auth.service';
import { DbService } from './db.service';
import 'leaflet/dist/images/marker-shadow.png';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private auth: AuthService,
              private db: DbService) { }

  private options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  ],
    zoom: 2,
    center: L.latLng([ 51.509865,  -0.118092 ])
  };

  private coordone = {
    libelle : 'Your position',
    latitude: 0,
    longitude: 0,
    message: 'This is where you are ' + this.auth.getData().nom + ' ' + this.auth.getData().prenom
  };
  layer = [];
  private layersControl = {
    overlays: { }
  };


  //#region this.coordonne
  getCoordonne() {
    return this.coordone;
  }

  setCoordone(latitude, longitude) {
    this.coordone.latitude = latitude;
    this.coordone.longitude = longitude;
  }
  //#endregion

 //#region mapOptions
  getOptions() {
    return this.options;
  }

  setOptions(zoom, latitude, longitude) {
    this.options.zoom = zoom;
    this.options.center = L.latLng([latitude, longitude]);
  }

 //#endregion

 // * pour l'affichage des points importants
//#region layersControl
  getLayersControl() {
    return this.layersControl;
  }

  setLayersControl(libelle, latitude, longitude, message) {

    this.layersControl.overlays[libelle] = L.marker([latitude, longitude], {
      icon: L.icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    }).bindPopup(message);
  }

//#endregion

// * pour la gestion des points importants
//#region layer
  getLayer() {
    return this.layer;
  }

  setLayer(item) {
    this.layer.push(item);
  }

  getLayerDb() {

    this.layer = [];
    this.db.getPointImportant(this.auth.getData().email).subscribe( (result) => {

      for (let i = 0, n = result.message.length; i < n; i++) {
        this.setLayer(result.message[i]);
      }
    });
  }
//#endregion

//#region pointImportant
  getPointImportant() {

    this.layersControl.overlays = {};

    this.db.getPointImportant(this.auth.getData().email).subscribe( (result) => {

      // pour rajouter la position de l'utilisateur au layers
      this.setLayersControl(this.coordone.libelle,
                            this.coordone.latitude,
                            this.coordone.longitude,
                            this.coordone.message);

      // ajouter les points enregistrer de l'utilisateur à l'overlay
      for (let i = 0, n  = result.message.length; i < n ; i ++) {

        this.setLayersControl(result.message[i].message,
                              result.message[i].latitude,
                              result.message[i].longitude,
                              result.message[i].message);
      }
    });
  }
//#endregion

}
