import { Pipe, PipeTransform, inject } from '@angular/core';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';

@Pipe({
  name: 'userName',
  standalone: true,
})
export class UserNamePipe implements PipeTransform {
  database = inject(SupabaseDb);

  transform(userId: string  | null | undefined): string {
    if (!userId) {
      return 'Unknown';
    }
    const users = this.database.users();

    if (users.length === 0) {
      this.database.getUsers().catch(() => {});
      return 'Loading...';
    }

    const user = users.find((u) => u.id === userId );

    return user ? user.name : `Unknown (${userId})`;
  }
}
