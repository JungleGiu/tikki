import { Component } from '@angular/core';
import { config } from '../../../shared/config';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerForm = new FormGroup({
    teamName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    adminName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    adminEmail: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(config.regex.email),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
      Validators.pattern(config.regex.password),
    ]),
  });

  
}
