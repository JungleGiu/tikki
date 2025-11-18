import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../../../../core/services/supabase';
import { CreateUserData, User } from '../../../../core/models/user';
@Component({
  selector: 'app-teams',
  imports: [ReactiveFormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  database = inject(Supabase);
  users = signal<User[]>([]);
  visible = signal<boolean>(false);
  userSelected = signal<User | null>(null);
  dialogType = signal<string>('');

  newUser = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)]),
    department: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  });

  updateUser = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)]),
    department: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
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
    try {
      this.database.users.subscribe((users) => {
        this.users.set(users);
      });
      this.database.getUsers();
      console.log('Utenti caricati:', this.users);
    } catch (err) {
      console.error('Errore nel caricamento:', err);
    }
  }

  onCreateUser() {
    if (this.newUser.invalid) {
      return;
    }
    let role = parseInt(this.newUser.value.role ?? '0');
    let department = parseInt(this.newUser.value.department ?? '0');

    const user: CreateUserData = {
      name: this.newUser.value.name ?? '',
      location: this.newUser.value.location?.split(',') ?? [],
      department_id: department,
      role_id: role,
      email: this.newUser.value.email ?? '',
    };
    this.database.createUser(user);
    this.visible.set(false);
    // this.users.update((oldUsers) => [...oldUsers, user as User]);
  }

  onDeleteUser(id: number) {
    this.database.deleteUser(id);
  }

  onEditUser() {
    if (this.updateUser.invalid) {
      return;
    }
    let role = parseInt(this.updateUser.value.role ?? '0');
    let department = parseInt(this.updateUser.value.department ?? '0');

    const user: CreateUserData = {
      name: this.updateUser.value.name ?? '',
      location: this.updateUser.value.location?.split(',') ?? [],
      department_id: department,
      role_id: role,
      email: this.updateUser.value.email ?? '',
    };

    this.database.updateUser(user, this.userSelected()?.id ?? 0);
    this.visible.set(false);
  }
}
