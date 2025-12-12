import { CanActivateFn } from '@angular/router';
import { supabaseAuth } from '../services/supabase/supabaseAuth';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(supabaseAuth);
  let user = supabase.appUser();
  if (!user) {
    await supabase.loadAppUser(supabase.authUser()?.id!);
    user = supabase.appUser();
  }
  const expectedRole = route.data['role'];
  if (user && expectedRole !== undefined) {
    if (user.role_id === expectedRole) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

export function getDashboardPathForRole(roleId: number): string {
  switch (roleId) {
    case 0:
      return '/dashboard-admin';
    case 1:
      return '/dashboard-manager';
    case 2:
      return '/dashboard-user';
    default:
      return '/login';
  }
}
