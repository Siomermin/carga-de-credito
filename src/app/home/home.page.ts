import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private authService = inject(AuthService);

  public loggedUser?: any = JSON.parse(localStorage.getItem('loggedUser')!)

  constructor() {}

  logout() {
    this.authService.logout();
  }
}
