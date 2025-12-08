import {
  Component,
  effect,
  Input,
  signal,
  inject,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Ticket, updateTicketDTO, createTicketDTO } from '../../../core/models/ticket';
import { User } from '../../../core/models/user';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StatusPipe } from '../../pipes/status-pipe';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { LocationInput } from '../location-input/location-input';
import { Badge } from '../badge/badge';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { timestamptzToDateInput, dateInputToTimestamptz } from '../../utils/date-utils';
@Component({
  selector: 'app-ticket-details',
  imports: [
    DatePipe,
    DepartmentPipePipe,
    Badge,
    PriorityPipe,
    ReactiveFormsModule,
    StatusPipe,
    UserNamePipe,
    ConfirmDeleteDialog,
    LocationInput,
  ],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails implements OnInit {
  @Input() ticket!: Ticket;
  @Input() mode = signal<'create' | 'edit' | 'view'>('view');
  @Input() isVisible = signal<boolean>(false);
  @Input() editMode = signal<boolean>(false);
  @Output() recharge = new EventEmitter<void>();
  deleteDialog = signal<boolean>(false);
  supabaseDb = inject(SupabaseDb);
  auth = inject(supabaseAuth);
  users = signal<User[]>([]);
  toastService = inject(ToastAppService);
  newLocation: any = null;

  ngOnInit() {
  const filtered = this.auth.users()
  }
  // Priority and Status mappings
  priorityOptions = [
    { value: 1, label: 'Critical' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Low' },
  ];

  statusOptions = [
    { value: '0', label: 'Queued' },
    { value: '1', label: 'Assigned' },
    { value: '2', label: 'In Progress' },
    { value: '3', label: 'Completed' },
  ];

  onLocationSelected(location: any) {
    this.newLocation = location;
  }
  editForm = new FormGroup({
    priority: new FormControl<string>(''),
    deadline: new FormControl(''),
    location: new FormControl(''),
    assigned_to: new FormControl<string | null>(null),
    description: new FormControl(''),
    status: new FormControl(''),
    title: new FormControl(''),
  });

  createForm = new FormGroup({
    department_id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl(''),
    assigned_to: new FormControl(''),
    status: new FormControl(''),
    deadline: new FormControl('', [Validators.required]),
    location: new FormControl(''),
  });
  constructor() {
    effect(() => {
      if (this.mode() === 'edit' && this.ticket) {
        const dateString = timestamptzToDateInput(this.ticket.deadline);

        this.editForm.patchValue(
          {
            title: this.ticket.title,
            description: this.ticket.description,
            location: this.ticket.location.name,
            priority: this.ticket.priority ? this.ticket.priority.toString() : '',
            deadline: dateString,
            assigned_to: this.ticket.assigned_to ? this.ticket.assigned_to.toString() : '',
            status: this.ticket.status ? this.ticket.status.toString() : '0',
          },
          { emitEvent: false }
        );
      }
    });
  }

  async onEditSubmit() {
    const deadlineValue = this.editForm.value.deadline;
    const deadlineString = dateInputToTimestamptz(deadlineValue, this.ticket.deadline);

 
    const assignedToValue = this.editForm.value.assigned_to
      ? this.editForm.value.assigned_to
      : null;
    let statusValue = this.editForm.value.status
      ? parseInt(this.editForm.value.status)
      : this.ticket.status;

    if ((statusValue === 1 || statusValue === 2 || statusValue === 3) && !assignedToValue) {
      this.toastService.showWarning(
        'Please assign the ticket to a user before changing its status.'
      );
      return;
    }

    const finalAssignedTo = statusValue === 0 ? null : assignedToValue;
    const finalStatusValue = finalAssignedTo && statusValue === 0 ? statusValue = 1 : statusValue;
    const resolvedAt = statusValue === 3 ? new Date().toISOString() : null;

    const updatedTicket: updateTicketDTO = {
      priority: this.editForm.value.priority
        ? parseInt(this.editForm.value.priority)
        : this.ticket.priority,
      deadline: deadlineString,
      location: this.newLocation ? this.newLocation : this.ticket.location,
      assigned_to: finalAssignedTo,
      status: finalStatusValue,
      company_ref: this.ticket.company_ref,
      resolved_at: resolvedAt,
    };

    try {
      await this.supabaseDb.updateTicket(updatedTicket, this.ticket.id);
      this.toastService.showSuccess('Ticket updated successfully');
      this.reset();
    } catch (error) {
      this.toastService.showError('Error updating ticket');
      console.error(error);
    }
  }

  async onCreateSubmit() {
    try {
      if (!this.createForm.value.department_id) {
        this.toastService.showWarning('Please select a department');
        return;
      }

      const deadlineValue = this.createForm.value.deadline;
      const deadlineString = dateInputToTimestamptz(deadlineValue);

      const currentUser = this.auth.authUser()?.id;
      const appUser = this.auth.appUser();
      const company_ref = appUser?.role_id === 0 ? appUser?.id ?? '' : appUser?.created_by ?? '';

      const newTicket: createTicketDTO = {
        created_by: currentUser ?? '',
        company_ref: company_ref,
        department_id: parseInt(this.createForm.value.department_id),
        title: this.createForm.value.title ? this.createForm.value.title : '',
        description: this.createForm.value.description ? this.createForm.value.description : '',
        priority: this.createForm.value.priority ? parseInt(this.createForm.value.priority) : 4,
        deadline: deadlineString,
        location: this.newLocation ? this.newLocation : { lat: '', lon: '' },
        assigned_to: this.createForm.value.assigned_to ? this.createForm.value.assigned_to : null,
        status: this.createForm.value.status ? parseInt(this.createForm.value.status) : 0,
      };

      await this.supabaseDb.createTicket(newTicket);
      this.toastService.showSuccess('Ticket created successfully');
      this.reset();
    } catch (error) {
      this.toastService.showError('Error creating ticket');
      console.error(error);
    }
  }
  async onDelete(id: string) {
    try {
      await this.supabaseDb.deleteTicket(id);
      this.toastService.showSuccess('Ticket deleted successfully');
      this.reset();
    } catch (error) {
      throw error;
    }
  }
  private reset() {
      this.recharge.emit();
      this.deleteDialog.set(false);
      this.editMode.set(false);
      this.mode.set('view');
      this.createForm.reset();
      this.newLocation = null;
      this.isVisible.set(false);
  }
}
