import { Component, Input, Output, EventEmitter, effect, signal, inject, computed } from '@angular/core';
import { User } from '../../../core/models/user';
import { LocationInput } from '../location-input/location-input';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { config } from '../../../shared/config';
@Component({
  selector: 'app-team-dialog',
  imports: [LocationInput, ReactiveFormsModule],
  templateUrl: './team-dialog.html',
  styleUrl: './team-dialog.scss',
})
export class TeamDialog {
  @Input({ required: true }) isVisible = signal<boolean>(false);
  @Input() user = signal<User | null>(null);
  @Input({ required: true }) mode = signal<string>('');

  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter<User>();
  @Output() locationChange = new EventEmitter<any>();
  @Output() passwordChange = new EventEmitter<any>();

  toast = inject(ToastAppService);
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(config.regex.email)]),
    role: new FormControl('', Validators.required),
  });
  passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
      Validators.pattern(config.regex.password),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(24),
      Validators.pattern(config.regex.password),
    ]),
  });
  constructor() {
    effect(() => {
      const userData = this.user();
      if ((userData && this.mode() === 'update') || (userData && this.mode() === 'onboarding')) {
        this.userForm.patchValue({
          name: userData.name,
          location: userData.location?.name,
          department: userData.department_id.toString(),
          email: userData.email,
          role: userData.role_id.toString(),
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.toast.showWarning('Please fill all the required fields');
      return;
    }
    if (this.mode() !== 'onboarding') {
      this.submit.emit(this.userForm.value as User);
      return;
    }
    if (this.passwordForm.invalid) {
      this.toast.showWarning('Please reset your password for your next login');
      return;
    }
    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.toast.showWarning('Passwords do not match');
      return;
    }
    this.submit.emit(this.userForm.value as User);
    this.passwordChange.emit(password);
  }

  onSaveLocation(location: any) {
    this.userForm.patchValue({ location: location.name });
    this.locationChange.emit(location);
  }
}
