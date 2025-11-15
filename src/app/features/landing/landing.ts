import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-landing',
  imports: [ RouterLink, ButtonModule ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
