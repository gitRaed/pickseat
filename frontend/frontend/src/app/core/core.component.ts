import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { DbService } from '../db.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements  AfterViewInit {

  // tslint:disable-next-line: max-line-length
  constructor(private mapService: MapService, private db: DbService, private modalService: NgbModal, private user: UserService, private auth: AuthService) { }

  message = 'Merci d\'utiliser Pickseat !';

  ngAfterViewInit() {

    navigator.geolocation.getCurrentPosition( (position) => this.mapService.findUser(position), () => this.mapService.didNotFindUser());
  }

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
