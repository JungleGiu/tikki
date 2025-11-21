import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppError } from '../../../core/services/errors/app-error';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  auth = inject(supabaseAuth);

  router = inject(Router);
  onSubmit() {
    this.auth
      .logiAdmin(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '')
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        
        throw new AppError(error.code);
      });
  }
}
