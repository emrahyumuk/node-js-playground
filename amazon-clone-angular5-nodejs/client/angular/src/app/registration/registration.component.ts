import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;

  btnDisabled = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
  }

  validate() {
    if (!this.name) this.data.error('Name is not entered');
    else if (!this.email) this.data.error('Email is not entered');
    else if (!this.password) this.data.error('Password is not entered');
    else if (this.password != this.password1) this.data.error('Passwords do not match');
    else return true;
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/signup',
          {
            name: this.name,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
          this.router.navigate(['profile/address']).then(() => {
            this.data.success('Registration Successful! Please enter your shipping address below');
          }).catch(error => this.data.error(error));
        } else {
          this.data.error(data['message']);
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
