import { CanActivateFn , Router} from '@angular/router';
import { Supabase } from '../services/supabase';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const supabase = inject(Supabase);
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
