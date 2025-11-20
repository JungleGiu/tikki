import { Component,inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../../core/services/supabase';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  auth = inject(Supabase)

 user = this.auth.appUser



  logout() {
    this.auth.logout();
  }
}
