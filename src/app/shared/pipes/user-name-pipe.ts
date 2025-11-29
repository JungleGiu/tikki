import { Pipe, PipeTransform, inject } from '@angular/core';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';

@Pipe({
  name: 'userName',
  standalone: true,
})
export class UserNamePipe implements PipeTransform {
  database = inject(SupabaseDb);

  transform(userId: string | number | null | undefined): string {
    if (!userId) {
      return 'Unknown';
    }

    // Ensure users are loaded
    const users = this.database.users();

    if (users.length === 0) {
      // Load users if not already loaded
      this.database.getUsers().catch(() => {});
      return 'Loading...';
    }

    // Convert userId to string for comparison
    const userIdStr = userId.toString().trim();
    const user = users.find((u) => u.id === userIdStr || u.id === userId);

    return user ? user.name : `Unknown (${userId})`;
  }
}
