import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private auth: AuthService) { }

  //#region  variables
  private options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  ],
    zoom: 2,
    center: L.latLng([ 51.509865,  -0.118092 ])
  };

  private layer = [];
  private layersControl = {
    overlays: { }
  };
  //#endregion

  //#region function
  getOptions() {

    return this.options;
  }

  setOptions(zoom, latitude, longitude) {
    this.options.zoom = zoom;
    this.options.center = L.latLng([latitude, longitude]);
  }

  setLayersControl(latitude, longitude, message) {

    this.layersControl.overlays['Your position'] = L.marker([latitude, longitude]).bindPopup(message);
  }

  getLayersControl() {

    return this.layersControl;
  }

  //#endregion
}
