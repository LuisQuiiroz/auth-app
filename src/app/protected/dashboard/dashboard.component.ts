import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
    * {
      margin: 15px;
    }
    button {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    `
  ]
})
export class DashboardComponent  {

  get usuario(){
    // obtiene la información del usuario
    return this.authService.usuario;
  }
  constructor( private router: Router,
               private authService: AuthService) { }

  logout(){
    this.router.navigateByUrl('auth/login');
    this.authService.logout();
  }
}
