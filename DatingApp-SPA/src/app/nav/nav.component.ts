import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from '@angular/compiler/src/util';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {}

  login() {
    // console.log(this.model);
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Logged in successfully');
      },

      // tslint:disable-next-line: no-shadowed-variable
      error => {
        // console.log("Failed to login");
        this.alertify.error(error);
      }
    );
  }

  loggedIn() {
    // const token = localStorage.getItem('token');
    // return !!token;
    return this.authService.loggedin();
  }
  logout() {
    localStorage.removeItem('token');
    this.alertify.message('User logout');
  }
}
