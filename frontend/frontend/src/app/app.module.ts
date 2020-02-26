import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { GererUsersComponent } from './gerer-users/gerer-users.component';

import { UserService } from './user.service';
import { DbService } from './db.service';
import { AuthentificationComponent } from './authentification/authentification.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    GererUsersComponent,
    AuthentificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot([
      {
        path: 'register',
        component : InscriptionComponent
      }, {
        path: 'gerer-users',
        component: GererUsersComponent
      }, {
        path: 'login',
        component: AuthentificationComponent
      }
    ])
  ],
  providers: [UserService, DbService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
