import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { User } from '../../../core/models/user';
import { RolePipePipe
 } from '../../pipes/role-pipe-pipe';
import { Badge } from '../badge/badge';
@Component({
  selector: 'app-team-table',
  imports: [RolePipePipe, Badge],
  templateUrl: './team-table.html',
  styleUrl: './team-table.scss',
})
export class TeamTable {
@Input() users = signal<User[]> ([]);

@Output() selectEdit = new EventEmitter<User>();
@Output() deleteUser = new EventEmitter<string>();


onSelectEdit(user: User) {
  this.selectEdit.emit(user);
}

onDeleteUser(id: string) {
  this.deleteUser.emit(id);
}

}
