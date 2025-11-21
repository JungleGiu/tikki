import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user';
import { SupabaseDb } from '../../../../core/services/supabase/supabase-db';
import { supabaseAuth } from '../../../../core/services/supabase/supabaseAuth';
import { AppError } from '../../../../core/services/errors/app-error';
import { config } from '../../../../shared/config';
import { LocationInput } from "../../../../shared/components/location-input/location-input";
@Component({
  selector: 'app-teams',
  imports: [ReactiveFormsModule, LocationInput],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  database = inject(SupabaseDb);
  companyId = inject(supabaseAuth).authUser()?.id;
  users = signal<User[]>([]);
  visible = signal<boolean>(false);
  userSelected = signal<User | null>(null);
  dialogType = signal<string>('');

  newUser = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)]),
    department: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(config.regex.email)],),
    role: new FormControl('', Validators.required),
  });

  updateUser = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)]),
    department: new FormControl('',[ Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.pattern(config.regex.email)]),
    role: new FormControl('', Validators.required),
  });

  showDialog() {
    this.visible.set(true);
  }
  selectUser(user: User) {
    this.userSelected.set(user);
    const selected = this.userSelected();
    if (selected) {
      this.updateUser.patchValue({
        name: selected.name,
        location: selected.location?.join(','),
        department: selected.department_id.toString(),
        email: selected.email,
        role: selected.role_id.toString(),
      });
    }
    this.dialogType.set('edit');
    this.showDialog();
  }

  async ngOnInit() {
    this.database
      .getUsers()
      .then((users) => {
        users = users.filter((user) => user.created_by === this.companyId);
        this.users.set(users);
      })
      .catch((error) => {
        throw new AppError(error.code);
      });
  }

  onCreateUser() {
    if (this.newUser.invalid) {
      throw new AppError('FILL_ALL_FIELDS');
    }
    let role = parseInt(this.newUser.value.role ?? '0');
    let department = parseInt(this.newUser.value.department ?? '0');

    const user: User = {
      name: this.newUser.value.name ?? '',
      location: this.newUser.value.location?.split(',') ?? [],
      department_id: department,
      role_id: role,
      email: this.newUser.value.email ?? '',
      created_by: this.companyId?? '0',
    };
    this.database.createUser(user);
    this.visible.set(false);
    this.users.update((oldUsers) => [...oldUsers, user as User]);
  }

  onDeleteUser(id: string) {
    if (id === '') {
      throw new AppError('USER_NOT_FOUND');
    }
    this.database.deleteUser(id);
  }

  onEditUser() {
    if (this.updateUser.invalid) {
      throw new AppError('FILL_ALL_FIELDS');
    }
    if (!this.userSelected()) {
      throw new AppError('USER_NOT_FOUND');
    }

    let role = parseInt(this.updateUser.value.role ?? '0');
    let department = parseInt(this.updateUser.value.department ?? '0');

    const user: User = {
      name: this.updateUser.value.name ?? '',
      location: this.updateUser.value.location?.split(',') ?? [],
      department_id: department,
      role_id: role,
      email: this.updateUser.value.email ?? '',
      created_by: this.companyId ?? '0',
    };

    const id = this.userSelected()?.id ?? '0';

    this.database.updateUser(user, id);
    this.visible.set(false);
  }
}
