import { CanActivateFn, Router } from '@angular/router';
import { supabaseAuth } from '../services/supabase/supabaseAuth';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = async(route, state) => {
  const supabase = inject(supabaseAuth);
  const router = inject(Router);

  while (!supabase.isInitialized()) {
    await new Promise((resolve) => setTimeout(resolve,50));
  } 

  const session = supabase.sessionSignal();

 
  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
