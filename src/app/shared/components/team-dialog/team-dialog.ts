import { Component, Input,Output,EventEmitter, effect,signal } from '@angular/core';
import { User } from '../../../core/models/user';
import { LocationInput } from '../location-input/location-input';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppError } from '../../../core/services/errors/app-error';
import { config } from '../../../shared/config';
@Component({
  selector: 'app-team-dialog',
  imports: [LocationInput, ReactiveFormsModule],
  templateUrl: './team-dialog.html',
  styleUrl: './team-dialog.scss',
})
export class TeamDialog {
@Input({required: true}) isVisible = signal<boolean>(false)
@Input() user = signal<User | null>(null)
@Input({required: true}) mode = signal<string>('create')

@Output() close = new EventEmitter()
@Output() submit = new EventEmitter<User>()
@Output() locationChange = new EventEmitter<any>()

userForm = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  location: new FormControl('',[ Validators.required] ),
  department: new FormControl('',[ Validators.required]),
  email: new FormControl('', [Validators.required, Validators.pattern(config.regex.email)]),
  role: new FormControl('', Validators.required),
})
constructor() {
  effect(() => {
    const userData = this.user();
    if (userData && this.mode() === 'update') {
      this.userForm.patchValue({
        name: userData.name,
        location: userData.location?.name,
        department: userData.department_id.toString(),
        email: userData.email,
        role: userData.role_id.toString(),
      })
    }
  })
}

onSubmit(){
  if(this.userForm.invalid){
  throw new AppError('FILL_ALL_FIELDS')
  }else{
    this.submit.emit(this.userForm.value as User)
  }
  }

  onSaveLocation(location: any) {
    this.userForm.patchValue({ location: location.name });
    this.locationChange.emit(location)
  }
}

