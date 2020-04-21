import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http: HttpClient) {}

  registerUser(nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

    return this.http.post < any > ('http://localhost:9500/register', {
      nom : '' + nom,
      prenom: '' + prenom,
      email: '' + email,
      numero: '' + numero,
      typeUser: '' + typeUser,
      motDePasse: '' + mdp
    });

  }

  getUsersData() {

    return this.http.get <any>('http://localhost:9500/data/getData');
  }

  updateUser(id: any, nom: string, prenom: string, email: string, numero: string, typeUser: string, mdp: string) {

  return this.http.post<any>('http://localhost:9500/data/updateData', {
    id,
    nom : '' + nom,
    prenom: '' + prenom,
    email: '' + email,
    numero: '' + numero,
    typeUser: '' + typeUser,
    motDePasse: '' + mdp
  });
  }

  deleteUser(id: any) {

    return this.http.post('http://localhost:9500/data/deleteData', {
      id
    });
  }

}
