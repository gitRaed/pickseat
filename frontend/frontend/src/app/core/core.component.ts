import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { DbService } from '../db.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements  OnInit {

  constructor(private mapService: MapService,
              private db: DbService,
              private modalService: NgbModal,
              private user: UserService,
              private auth: AuthService) { }

  message = 'Merci d\'utiliser Pickseat !';


  ngOnInit(): void {

    navigator.geolocation.getCurrentPosition( (position) => {

      // si l'user accepte de donner sa position
      this.mapService.setOptions(15, position.coords.latitude, position.coords.longitude);
      this.mapService.setLayersControl(position.coords.latitude, position.coords.longitude, 'This is where you are');
    }, () => {
      // s'il n'accepte pas
      console.log('Uh.. ok, i will still find your location even if it is not accurate');
      fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(result => {
        this.mapService.setOptions(15, result.latitude, result.longitude);
        this.mapService.setLayersControl(result.latitude, result.longitude, 'Approximation of your position');
      });
    });
  }


  //#region mapFunction
  onMapReady(map: L.Map) {
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

  recup(event) {
    console.log(event.latlng.lat);
  }
  //#endregion

  modal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }
  contactUs(event) {

    event.preventDefault();
    const target = event.target;

    const data = {
      email: target.querySelector('#email_user').value,
      message: target.querySelector('#message_user').value,
    };

    if (this.auth.getData().token !== null) {
      this.user.appelUnicite(data.email, 'somePassword', 'register').subscribe( (result) => {

        console.log(result);
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

}
