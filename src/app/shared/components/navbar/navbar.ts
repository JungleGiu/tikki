import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule} from 'primeng/card';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ButtonModule, CardModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

}
