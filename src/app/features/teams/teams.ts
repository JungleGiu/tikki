import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { AppError } from '../../core/services/errors/app-error';
import { ToastAppService } from '../../core/services/toast/toast-service';
import { DataTable } from '../../shared/components/data-table/data-table';
import { PaginationTool } from '../../shared/components/pagination-tool/pagination-tool';
import { TeamDialog } from '../../shared/components/team-dialog/team-dialog';
import { ConfirmDeleteDialog } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog';
import { Searcher } from '../../shared/components/searcher/searcher';
@Component({
  selector: 'app-teams',
  imports: [DataTable, TeamDialog, PaginationTool, ConfirmDeleteDialog, Searcher],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  database = inject(SupabaseDb);
  auth = inject(supabaseAuth);
  toast = inject(ToastAppService);
  allUsers = signal<User[]>([]);
  displayUsers = signal<User[]>([]);
  visible = signal<boolean>(false);
  userSelected = signal<User | null>(null);
  locationSelected = signal<any | null>(null);
  dialogType = signal<string>('');
  companyId = this.auth.authUser()?.id;
  deleteConfirmation = signal<boolean>(false);

  async ngOnInit() {
    this.database
      .getUsers()
      .then(() => {
        const filteredUsers = this.database
          .users()
          .filter((user) => user.id !== this.auth.authUser()?.id);
        this.allUsers.set(filteredUsers);
        this.displayUsers.set(filteredUsers);
      })
      .catch((error) => {
        throw new AppError(error.code);
      });
  }

  openCreateDialog() {
    this.dialogType.set('create');
    this.userSelected.set(null);
    this.locationSelected.set(null);
    this.visible.set(true);
  }
  openUpdateDialog(user: User) {
    this.dialogType.set('update');
    this.userSelected.set(user);
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
    await this.database.getUsers();
    let filteredUsers = this.database
      .users()
      .filter((user) => user.id !== this.auth.authUser()?.id);
    this.displayUsers.set(filteredUsers);
    this.allUsers.set(filteredUsers);
  }

  async createUser(formData: any) {
    const loc = this.locationSelected();
    const user: User = {
      name: formData.name,
      location: loc ? { name: loc.name, lat: loc.lat, lon: loc.lon } : null,
      department_id: parseInt(formData.department),
      role_id: parseInt(formData.role),
      email: formData.email,
      created_by: this.companyId ?? '0',
    };

    const { success } = await this.auth.createUserViaFunction(user);
    if (success) {
      this.toast.showSuccess('User created successfully');
    }
    const newUsers = await this.database.getUsers();
    const filteredUsers = newUsers.filter((user) => user.created_by === this.companyId);
    this.allUsers.set(filteredUsers);
    this.displayUsers.set(filteredUsers);
    this.closeDialog();
  }

  async updateUser(formData: any) {
    if (!this.userSelected()) return;
    const loc = this.locationSelected();
    const user: User = {
      name: formData.name,
      location: loc ? { name: loc.name, lat: loc.lat, lon: loc.lon } : null,
      department_id: parseInt(formData.department),
      role_id: parseInt(formData.role),
      email: formData.email,
      created_by: this.companyId ?? '0',
    };

    await this.database.updateUser(user, this.userSelected()!.id!);
    const filteredUsers = this.database
      .users()
      .filter((user) => user.created_by === this.companyId);
    this.allUsers.set(filteredUsers);
    this.displayUsers.set(filteredUsers);
    this.closeDialog();
  }

  onSaveLocation(location: any) {
    this.locationSelected.set(location);
  }

  async onDeleteUser(id: string) {
    this.deleteConfirmation.set(true);
    this.userSelected.set(this.allUsers()?.find((user) => user.id === id) ?? null);
  }
  async onDeleteConfirm(id: string) {
    if (id === '') {
      throw new AppError('USER_NOT_FOUND');
    }
    this.deleteConfirmation.set(false);
    await this.database.deleteUser(id);
    const filteredUsers = this.database
      .users()
      .filter((user) => user.created_by === this.companyId);
    this.allUsers.set(filteredUsers);
    this.displayUsers.set(filteredUsers);
  }

  closeDialog() {
    this.visible.set(false);
    this.userSelected.set(null);
    this.locationSelected.set(null);
  }
  onSearch(users: User[]) {
    this.displayUsers.set(users);
  }
}
