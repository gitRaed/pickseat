import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private auth: AuthService) { }

  map: L.Map | L.LayerGroup<any>;
  private data = this.auth.getData();
  private location = {
    latitude : 51.509865,
    longitude : -0.118092,
    zoom : 3
  };



   // déclaration de la map avec les coordonnées du centre et du zoom
  initMap() {

    this.map = L.map('map').setView([this.location.latitude, this.location.longitude], this.location.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  findUser(position) {

    this.location.latitude = position.coords.latitude;
    this.location.longitude = position.coords.longitude;
    this.location.zoom = 15;
    this.initMap();
    // console.log('Coordonnées : [' + position.coords.latitude + ', ' + position.coords.longitude + ']');
    this.addPoppup(this.map, position.coords.latitude, position.coords.longitude);
    return this.map;
  }

  didNotFindUser() {

    console.log('Uh.. ok, i will still find your location even if it is not accurate');
    fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(result => {
        this.location.latitude = result.latitude;
        this.location.longitude = result.longitude;
        this.location.zoom = 15;
        this.initMap();
        // console.log('Coordonnées : [' + result.latitude + ', ' + result.longitude + ']');
        this.addPoppup(this.map, this.location.latitude, this.location.longitude);
        return this.map;
      });
  }

  addPoppup(map, latitude, longitude) {

      // déclaration de l'icon du popup
      const icon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
      });

      // déclaration du popup
      L.marker([latitude, longitude], {icon})
        .bindPopup('This is where you are ' + this.data.nom + ' ' + this.data.prenom)
        .addTo(map);
  }


}
