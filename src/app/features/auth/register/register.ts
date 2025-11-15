import { Component } from '@angular/core';
import { ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

    registrerForm = new FormGroup({
        teamName: new FormControl('',[Validators.required, Validators.minLength(3)]),
        adminName: new FormControl('',[Validators.required, Validators.minLength(3)]),
        adminEmail: new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    }
    );

    

}
