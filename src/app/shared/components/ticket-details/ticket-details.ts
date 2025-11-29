import { Component, effect, Input, signal } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { DatePipe } from '@angular/common';
import{ FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms'
import { StatusPipe } from '../../pipes/status-pipe';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import {PriorityPipe} from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, DepartmentPipePipe , Badge, PriorityPipe, ReactiveFormsModule, StatusPipe, UserNamePipe],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
@Input({required: true}) ticket !: Ticket 
@Input() mode = signal<string>('')
@Input() isVisible = signal<boolean>(false)
@Input() editMode = signal<boolean>(false)


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
//  priority: this.ticket.priority,
  deadline : this.ticket.deadline,
  location : this.ticket.location.name,
  // assigned_to : this.ticket.assigned_to,

  status : this.ticket.status
})
  }
})
}


}
