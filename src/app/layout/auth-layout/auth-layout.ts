import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { getDashboardPathForRole } from '../../core/guards/role-guard';

export interface Feature {
  key: string;
  path: string;
  label: string;
}

@Component({
  selector: 'app-auth-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  authService = inject(supabaseAuth);
  user = this.authService.appUser();

  constructor() {
    if (!this.user) {
      this.authService.loadAppUser(this.authService.authUser()?.id!);
    }
  }
  allFeatures = computed(() => {
    const currentUser = this.user;
    const dashboardPath = currentUser ? getDashboardPathForRole(currentUser.role_id) : 'dashboard';
    return [
      { key: 'dashboard', path: dashboardPath, label: 'Dashboard' },
      { key: 'tickets', path: `${dashboardPath}/tickets`, label: 'Tickets' },
      { key: 'teams', path: `${dashboardPath}/teams`, label: 'Teams' },
      { key: 'kanban', path: `${dashboardPath}/kanban`, label: 'Kanban' },
      { key: 'chat', path: `${dashboardPath}/chat`, label: 'Chat' },
    ];
  });

  roleFeatures: Record<number, string[]> = {
    0: ['dashboard', 'tickets', 'teams', 'chat'],
    1: ['dashboard', 'tickets', 'teams', 'kanban', 'chat'],
    2: ['dashboard', 'tickets', 'kanban', 'chat'],
  };

  computedRoutes = computed(() => {
    const currentUser = this.user;
    if (!currentUser) return [];

    const userFeatureKeys = this.roleFeatures[currentUser.role_id] || [];
    return this.allFeatures().filter((f) => userFeatureKeys.includes(f.key));
  });
}
