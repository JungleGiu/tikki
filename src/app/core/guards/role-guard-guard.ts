import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { supabaseAuth } from '../services/supabase/supabaseAuth';
import { inject } from '@angular/core';
export const roleGuardGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(supabaseAuth);
  const router = inject(Router);

  const user = supabase.appUser();

  if (!user) {
  await supabase.loadAppUser(supabase.authUser()?.id!);
  }
 const expectedRole = route.data['role'];
    if (user) {
    // Check if user's role matches the expected role
    if (expectedRole && user.role_id !== expectedRole) {
      // Redirect to appropriate dashboard based on role_id
      redirectToDashboard(user.role_id, router);
      return false;
    }
  }
  return true;
};

function redirectToDashboard(roleId: number, router: Router): void {
  switch(roleId) {
    case 1: // Admin
      router.navigate(['/dashboard/admin']);
      break;
    case 2: // Manager
      router.navigate(['/dashboard/manager']);
      break;
    case 3: // User
      router.navigate(['/dashboard/user']);
      break;
    default:
      // Handle other roles if needed
      break;
  }
}