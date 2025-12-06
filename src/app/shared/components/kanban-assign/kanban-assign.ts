import { Component, EventEmitter, Output, inject } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kanban-assign',
  imports: [FormsModule],
  templateUrl: './kanban-assign.html',
  styleUrl: './kanban-assign.scss',
})
export class KanbanAssign {
  userId: string | null = null;
  @Output() close = new EventEmitter<string | null>();

  auth = inject(supabaseAuth);
  users = this.auth.users;
}
