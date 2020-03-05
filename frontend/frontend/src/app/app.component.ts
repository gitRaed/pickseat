import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private auth: AuthService) {}

  data = this.auth.getData();

  ngOnInit() {

    this.auth.setData('Connectez', 'vous', '');
  }


}
