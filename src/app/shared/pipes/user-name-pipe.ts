import { Pipe, PipeTransform, inject } from '@angular/core';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';

@Pipe({
  name: 'userName',
  standalone: true,
})
export class UserNamePipe implements PipeTransform {
  auth = inject(supabaseAuth);

  transform(userId: string | null | undefined): string {
    if (!userId) {
      return 'Unassigned';
    }

    const users = this.auth.users();
    
 
    if (users.length === 0) {
      return 'Loading...';
    }
    
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Unknown';
  }
}
