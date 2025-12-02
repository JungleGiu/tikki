import { Component, effect, Input, signal ,inject, Output, EventEmitter} from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { DatePipe } from '@angular/common';
import{ FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms'
import { StatusPipe } from '../../pipes/status-pipe';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import {PriorityPipe} from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { Badge } from '../badge/badge';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';

@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, DepartmentPipePipe , Badge, PriorityPipe, ReactiveFormsModule, StatusPipe, UserNamePipe, ConfirmDeleteDialog],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
@Input({required: true}) ticket !: Ticket 
@Input() mode = signal<string>('')
@Input() isVisible = signal<boolean>(false)
@Input() editMode = signal<boolean>(false)
@Output() recharge = new EventEmitter<void>()
deleteDialog = signal<boolean>(false)
supabaseDb = inject(SupabaseDb)
toastService = inject(ToastAppService)

editForm = new FormGroup({
  priority: new FormControl(''),
  deadline : new FormControl(''),
  location : new FormControl(''),
  assigned_to : new FormControl(''),
  status : new FormControl('')
})

createForm = new FormGroup({
  department_id: new FormControl(''),
  title: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
  priority: new FormControl(''),
  deadline : new FormControl(''),
  location : new FormControl(''),
  status : new FormControl('')
})
constructor() {
effect(() => {
  if (this.editMode()){
this.editForm.patchValue({
 priority: this.ticket.priority.toString(),
  deadline : this.ticket.deadline,
  location : this.ticket.location.name,
  assigned_to : this.ticket.assigned_to.toString(),
  status : this.ticket.status
})
  }
})
}

onEditSubmit() {
  console.log(this.editForm.value);
}

async onDelete(id: string) {
  try {
    await this.supabaseDb.deleteTicket(id);
    this.toastService.showSuccess('Ticket deleted successfully');
    this.recharge.emit();
    this.deleteDialog.set(false);
    this.isVisible.set(false);
  } catch (error) {
   throw error;
  }
}

}
