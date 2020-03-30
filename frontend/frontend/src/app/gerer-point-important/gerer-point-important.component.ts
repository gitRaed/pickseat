import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DbService } from '../db.service';
import { MapService } from '../map.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gerer-point-important',
  templateUrl: './gerer-point-important.component.html',
  styleUrls: ['./gerer-point-important.component.css']
})
export class GererPointImportantComponent implements OnInit {

  constructor(private auth: AuthService,
              private mapService: MapService,
              private db: DbService,
              private modalService: NgbModal) { }

  message = '';
  layer = [];
  email = this.auth.getData().email;

  ngOnInit() {

    this.getLayer();
  }

  modal(content: any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  getLayer() {

    this.mapService.getLayerDb();
    this.layer = this.mapService.getLayer();
  }


  updatePointImportant(event) {

    event.preventDefault();
    const target = event.target;

    const id = target.querySelector('#id_user').value;
    const email = target.querySelector('#email_user').value;
    const message = target.querySelector('#message_user').value;
    const sonner = target.querySelector('#sonner').value;

    this.db.updatePointImportant(id, email, message, sonner).subscribe( (result) => {
      this.message = result.message;
      this.getLayer();
      this.mapService.getPointImportant();
    });
  }

  deletePointImportant(id: any) {

    this.db.supprimerPointImportant(id).subscribe( (result) => {
      this.message = result.message;
      this.getLayer();
      this.mapService.getPointImportant();
    });
  }

}
