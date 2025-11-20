import { Component, inject } from '@angular/core';
import { config } from '../../../shared/config';
import { Supabase } from '../../../core/services/supabase';
import { Company } from '../../../core/models/user';  
import { Router } from '@angular/router';
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

    adminEmail: new FormControl('', [
      Validators.required,
      Validators.pattern(config.regex.email),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
      Validators.pattern(config.regex.password),
    ]),
  });

  auth = inject(Supabase)
  submitError: string | null = null;
  router = inject(Router)
  onSubmit() {
    if (this.registerForm.valid && this.registerForm.dirty) { 
      const teamName = this.registerForm.controls.teamName.value ;
      const adminEmail = this.registerForm.controls.adminEmail.value ;
      const password = this.registerForm.controls.password.value;
      
      if (!teamName || !adminEmail || !password) {
      this.submitError = 'All fields are required.';
      return;
    }
      const newAdmin : Company = {
        role_id: 0,
        name: teamName,
        email: adminEmail,
      }
      this.auth.registerCompany(newAdmin, adminEmail, password).then(
        () => {
          this.submitError = null;
        }
      ).catch(
        (error) => {
          this.submitError = error.message;
          this.registerForm.reset();
        }
      ).finally(
        () => {
          this.router.navigate(['/dashboard']);
        }
      );
    }
    else {
      this.submitError = 'Please fill all the required fields with valid values.';
    }
  }
  
}
