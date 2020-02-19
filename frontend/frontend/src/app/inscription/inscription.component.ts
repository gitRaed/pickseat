import {
  Component,
  OnInit
} from '@angular/core';
import { UserService } from '../user.service';
import { DbService } from '../db.service';



@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  message = '';

  constructor(private user: UserService, private db: DbService) {}


  ngOnInit() {}

  register(event) {

    this.message = this.user.options('register', event);
  }

}
