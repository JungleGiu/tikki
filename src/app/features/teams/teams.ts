import { Component, inject, OnInit, signal, effect } from '@angular/core';
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
export class Teams {
  database = inject(SupabaseDb);
  auth = inject(supabaseAuth);
  toast = inject(ToastAppService);
  allUsers = signal<User[]>([]);
  afterSearchUsers = signal<User[]>([]);
  displayUsers = signal<User[]>([]);
  visible = signal<boolean>(false);
  userSelected = signal<User | null>(null);
  locationSelected = signal<any | null>(null);
  dialogType = signal<string>('');
  companyId = this.auth.authUser()?.id;
  deleteConfirmation = signal<boolean>(false);
  roleId = this.auth.appUser()?.role_id;
  departmentId = this.auth.appUser()?.department_id;

  constructor() {
    effect(() => {
      const users = this.auth.users();
      const filteredUsers = users.filter((user: User) => user.id !== this.auth.authUser()?.id);
      this.allUsers.set(filteredUsers);
      if (this.roleId === 0) {
        this.displayUsers.set(filteredUsers);
        this.afterSearchUsers.set(filteredUsers);
      } else {
        const displayedUsers = filteredUsers.filter(
          (user: User) => user.department_id == this.departmentId
        );
        this.displayUsers.set(displayedUsers);
        this.afterSearchUsers.set(displayedUsers);
      }
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
    this.refreshUsersList();
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
    this.refreshUsersList();
  }

  closeDialog() {
    this.visible.set(false);
    this.userSelected.set(null);
    this.locationSelected.set(null);
  }

  private refreshUsersList() {
    const users = this.auth.users();
    this.allUsers.set(users);
    if (this.roleId === 0) {
      const filteredUsers = users.filter((user: User) => user.id !== this.auth.authUser()?.id);
      this.displayUsers.set(filteredUsers);
    } else {
      const displayedUsers = users.filter((user: User) => user.department_id == this.departmentId);
      this.displayUsers.set(displayedUsers);
    }
  }
}
