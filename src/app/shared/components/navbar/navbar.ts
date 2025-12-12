import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { RolePipe } from '../../pipes/role-pipe';
import { User } from '../../../core/models/user';
import { Feature } from '../../../layout/auth-layout/auth-layout';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, RolePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(supabaseAuth);
  router = inject(Router);
  @Input() user: User | null = null;
  @Input() featuresRoutes: Feature[] = [];
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
