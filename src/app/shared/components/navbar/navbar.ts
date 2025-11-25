import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { RolePipePipe } from '../../pipes/role-pipe-pipe';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RolePipePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(supabaseAuth);
  router = inject(Router);
  user = this.auth.appUser;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
