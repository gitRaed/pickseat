import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { DbService } from '../db.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements AfterViewInit {

  constructor(private mapService: MapService, private db: DbService) { }

  private map: L.Map | L.LayerGroup<any>;
  private states;

  ngAfterViewInit(): void {

    this.initMap();

    // trace les contours de l'etat, ici les US
    this.db.getStatesShapes().subscribe(states => {
      this.states = states;
      const statesLayer = this.mapService.initStatesLayer(this.states);
      this.map.addLayer(statesLayer);
    });
    this.mapService.addPoppup(this.map);
  }

  // déclaration de la map avec les coordonnées du centre et du zoom
  initMap() {

    this.map = L.map('map').setView([50.6311634, 3.0599573], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

}
