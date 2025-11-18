import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm = new FormGroup({
    teamName: new FormControl(''),
    adminName: new FormControl(''),
    adminEmail: new FormControl(''),
    password: new FormControl(''),
  });
}
