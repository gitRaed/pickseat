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




@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    GererUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [UserService,DbService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
