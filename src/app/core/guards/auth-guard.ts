import { CanActivateFn, Router } from '@angular/router';
import { supabaseAuth } from '../services/supabase-auth/supabaseAuth';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const supabase = inject(supabaseAuth);
  const router = inject(Router);

  const session = supabase.sessionSignal();
  if (session == undefined) {
    return false;
  }
  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
