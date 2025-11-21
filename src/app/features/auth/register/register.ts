import { Component, inject } from '@angular/core';
import { config } from '../../../shared/config';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { Company } from '../../../core/models/user';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppError } from '../../../core/services/errors/app-error';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm = new FormGroup({
    teamName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]),

    adminEmail: new FormControl('', [Validators.required, Validators.pattern(config.regex.email)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
      Validators.pattern(config.regex.password),
    ]),
  });

  auth = inject(supabaseAuth);

  router = inject(Router);
  onSubmit() {
    if (this.registerForm.valid && this.registerForm.dirty) {
      const teamName = this.registerForm.controls.teamName.value;
      const adminEmail = this.registerForm.controls.adminEmail.value;
      const password = this.registerForm.controls.password.value;

      if (!teamName || !adminEmail || !password) {
        throw new AppError('FILL_ALL_FIELDS');
        return;
      }
      const newAdmin: Company = {
        role_id: 0,
        name: teamName,
        email: adminEmail,
      };
      this.auth
        .registerCompany(newAdmin, adminEmail, password)
        .then(() => {
          this.router.navigate(['/dashboard']);
        })
        .catch((error) => {
          this.registerForm.reset();
          throw new AppError(error.code);
        });
    } else {
      throw new AppError('FILL_ALL_FIELDS');
    }
  }
}
