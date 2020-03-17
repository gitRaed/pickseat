import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from './auth.service';
import { DbService } from './db.service';

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

  layer = [];
  private layersControl = {
    overlays: { }
  };



 //#region mapOptions
  getOptions() {
    return this.options;
  }

  setOptions(zoom, latitude, longitude) {
    this.options.zoom = zoom;
    this.options.center = L.latLng([latitude, longitude]);
  }

 //#endregion

//#region layersControl
  getLayersControl() {
    return this.layersControl;
  }

  setLayersControl(libelle, latitude, longitude, message) {
    this.layersControl.overlays[libelle] = L.marker([latitude, longitude]).bindPopup(message);
  }

//#endregion

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
