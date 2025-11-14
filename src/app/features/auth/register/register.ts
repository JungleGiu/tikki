import { Component } from '@angular/core';
import { MatCard, MatCardTitle, MatCardHeader } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAnchor } from "@angular/material/button";
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [MatCard, MatCardTitle, MatCardHeader, MatFormFieldModule, MatAnchor],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

    registrerForm = new FormGroup({
        teamName: new FormControl(''),
        adminName: new FormControl(''),
        adminEmail: new FormControl(''),
        password: new FormControl(''),
    }
    );
}
