import { Component, effect, Input, signal, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { User } from '../../../core/models/user';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { StatusPipe } from '../../pipes/status-pipe';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { Badge } from '../badge/badge';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { LocationInput } from '../location-input/location-input';
import { createTicketDTO } from '../../../core/models/ticket';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
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

  async ngOnInit() {
    try {
      const usersData = await this.supabaseDb.getUsers();
      this.users.set(usersData);
    } catch (error) {
      throw error;
    }
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
    priority: new FormControl(''),
    deadline: new FormControl(''),
    location: new FormControl(''),
    assigned_to: new FormControl(''),
    status: new FormControl(''),
  });

  createForm = new FormGroup({
    department_id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl(''),
    deadline: new FormControl('', [Validators.required]),
    location: new FormControl(''),
  });
  constructor() {
    effect(() => {
      if (this.mode() === 'edit' && this.ticket) {
        let dateString = '';
        if (this.ticket.deadline) {
          dateString = this.ticket.deadline.split('T')[0];
        }
      
        this.editForm.patchValue(
          {
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

  onEditSubmit() {
    try {
      if (!this.ticket) return;

      const deadlineValue = this.editForm.value.deadline;
      let deadlineString = this.ticket.deadline;

      if (deadlineValue) {
        if (!isNaN(Date.parse(deadlineValue))) {
          const deadlineDate = new Date(deadlineValue);
          deadlineString = deadlineDate.toISOString();
        } else {
          deadlineString = deadlineValue;
        }
      }

      const updatedTicket: Partial<Ticket> = {
        priority: this.editForm.value.priority
          ? parseInt(this.editForm.value.priority)
          : this.ticket.priority,
        deadline: deadlineString,
        location: this.newLocation ? this.newLocation : this.ticket.location,
        assigned_to: this.editForm.value.assigned_to
          ? this.editForm.value.assigned_to
          : this.ticket.assigned_to,
        status: this.editForm.value.status ? parseInt(this.editForm.value.status) : this.ticket.status,
      };

      this.supabaseDb.updateTicket(updatedTicket, this.ticket.id).then(() => {
        this.toastService.showSuccess('Ticket updated successfully');
        this.recharge.emit();
        this.isVisible.set(false);
        this.editMode.set(false);
      });
    } catch (error) {
      throw error;
    }
  }

  onCreateSubmit() {
    try {
      const deadlineValue = this.createForm.value.deadline;
      let deadlineString = '';

      if (deadlineValue) {
        if (!isNaN(Date.parse(deadlineValue))) {
          const deadlineDate = new Date(deadlineValue);
          deadlineString = deadlineDate.toISOString();
        } else {
          deadlineString = deadlineValue;
        }
      }
      const currentUser = this.auth.authUser()?.id;
      const newTicket: createTicketDTO = {
        created_by: currentUser ?? '',

        department_id: this.createForm.value.department_id
          ? parseInt(this.createForm.value.department_id)
          : 0,
        title: this.createForm.value.title ? this.createForm.value.title : '',
        description: this.createForm.value.description ? this.createForm.value.description : '',
        priority: this.createForm.value.priority ? parseInt(this.createForm.value.priority) : 4,
        deadline: deadlineString,
        location: this.newLocation ? this.newLocation : { lat: '', lon: '' },
        assigned_to: null,
        status: '0',
      };

      this.supabaseDb.createTicket(newTicket).then(() => {
        this.toastService.showSuccess('Ticket created successfully');
        this.recharge.emit();
        this.isVisible.set(false);
      });
    } catch (error) {
      throw error;
    }
  }
  async onDelete(id: string) {
    try {
      await this.supabaseDb.deleteTicket(id);
      this.toastService.showSuccess('Ticket deleted successfully');
      this.recharge.emit();
      this.deleteDialog.set(false);
      this.editMode.set(false);
      this.isVisible.set(false);
    } catch (error) {
      throw error;
    }
  }
}
