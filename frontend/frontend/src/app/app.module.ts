import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { GererUsersComponent } from './gerer-users/gerer-users.component';

import { UserService } from './user.service';
import { DbService } from './db.service';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { CoreComponent } from './core/core.component';



@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    GererUsersComponent,
    AuthentificationComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    CoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    LeafletModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: AuthentificationComponent
      },
      {
        path: 'register',
        component : InscriptionComponent
      },
      {
        path: 'gerer-users',
        component: GererUsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'mdpForgot/:email',
        component: ForgotPasswordComponent
      },
      {
        path: 'map',
        component: CoreComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ])
  ],
  providers: [
    UserService,
    DbService,
    HttpClient,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
