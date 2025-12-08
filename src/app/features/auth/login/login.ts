import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppError } from '../../../core/services/errors/app-error';
import { getDashboardPathForRole } from '../../../core/guards/role-guard-guard';

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
        const user = this.auth.appUser();
        if (user) {
          // Redirect to the correct dashboard based on user role
          this.router.navigate([getDashboardPathForRole(user.role_id)]);
        }
      })
      .catch((error) => {
        throw new AppError(error.code);
      });
  }
}
