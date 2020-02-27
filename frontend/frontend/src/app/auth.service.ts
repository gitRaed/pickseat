import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private logStatus = false;

  getLogStatus(): boolean {
    return this.logStatus;
  }

  setLogStatus(value: boolean) {
    this.logStatus = value;
  }


}
