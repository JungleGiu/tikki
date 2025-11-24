import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../../core/models/user';
import { SupabaseDb } from '../../../../core/services/supabase/supabase-db';
import { supabaseAuth } from '../../../../core/services/supabase/supabaseAuth';
import { AppError } from '../../../../core/services/errors/app-error';
import { ToastAppService } from '../../../../core/services/toast/toast-service';
import { TeamTable } from "../../../../shared/components/team-table/team-table";
import { TeamDialog } from "../../../../shared/components/team-dialog/team-dialog";
@Component({
  selector: 'app-teams',
  imports: [ TeamTable, TeamDialog],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  database = inject(SupabaseDb);
 auth = inject(supabaseAuth)

  users = signal<User[]>([]);
  visible = signal<boolean>(false);
  userSelected = signal<User | null>(null);
  locationSelected = signal<any | null>(null);
  dialogType = signal<string>('');
  companyId = this.auth.authUser()?.id;
  async ngOnInit() {
    this.database
      .getUsers()
      .then(() => {
        this.users.set(this.database.users().filter(user => user.created_by === this.companyId));
      })
      .catch((error) => {
        throw new AppError(error.code);
      });
  }
  
  openCreateDialog() {
    this.dialogType.set('create')
    this.userSelected.set(null)
    this.locationSelected.set(null)
    this.visible.set(true);
  }
  openUpdateDialog(user: User) {
    this.dialogType.set('update')
    this.userSelected.set(user)

    this.visible.set(true);
  }
  selectUser(user: User) {
    this.userSelected.set(user);
    const selected = this.userSelected();
    this.locationSelected.set(selected?.location);
  }


 async onDialogSubmit(formData: any) {
    if (this.dialogType() === 'create') {
      await this.createUser(formData);
    } else {
      await this.updateUser(formData);
    }
    this.visible.set(false);
    this.userSelected.set(null);
    this.locationSelected.set(null);
  }

  async createUser(formData: any) {
    const loc = this.locationSelected();
    const user: User = {
      name: formData.name,
      location: loc? {name: loc.name, lat: loc.lat, lon: loc.lon} : null,
      department_id: parseInt(formData.department),
      role_id: parseInt(formData.role),
      email: formData.email,
      created_by: this.companyId ?? '0',
    };
    
    await this.auth.createUserViaFunction(user);
    const newUsers = await this.database.getUsers()
    newUsers.filter(user => user.created_by === this.companyId);
     this.users.set(newUsers);
    this.closeDialog();
  }

  async updateUser(formData: any) {
    if (!this.userSelected()) return;
    const loc = this.locationSelected();
    const user: User = {
      name: formData.name,
      location: loc? {name: loc.name, lat: loc.lat, lon: loc.lon} : null,
      department_id: parseInt(formData.department),
      role_id: parseInt(formData.role),
      email: formData.email,
      created_by: this.companyId ?? '0',
    };

   await this.database.updateUser(user, this.userSelected()!.id!);
     this.users.set(this.database.users().filter(user => user.created_by === this.companyId)); 
    this.closeDialog();
  }

  onSaveLocation(location: any) {
    this.locationSelected.set(location);
  }
  async onDeleteUser(id: string) {
    if (id === '') {
      throw new AppError('USER_NOT_FOUND');
    }
   await this.database.deleteUser(id);
    this.users.update((users) => users.filter(user => user.id !== id));
  }

  closeDialog() {
    this.visible.set(false);
    this.userSelected.set(null);
    this.locationSelected.set(null);
  }
}
