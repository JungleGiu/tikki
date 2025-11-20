import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase-auth/supabaseAuth';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(supabaseAuth);

  user = this.auth.appUser;

  logout() {
    this.auth.logout();
  }
}
