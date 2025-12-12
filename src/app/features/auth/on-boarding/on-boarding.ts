import { Component, OnInit, signal, inject, effect, AfterViewInit } from '@angular/core';
import { TeamDialog } from '../../../shared/components/team-dialog/team-dialog';
import { User } from '../../../core/models/user';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { AppError } from '../../../core/services/errors/app-error';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Router } from '@angular/router';
import { getDashboardPathForRole } from '../../../core/guards/role-guard';
@Component({
  selector: 'app-on-boarding',
  imports: [TeamDialog],
  templateUrl: './on-boarding.html',
  styleUrl: './on-boarding.scss',
})
export class OnBoarding implements OnInit {
  toast = inject(ToastAppService);
  database = inject(SupabaseDb);
  auth = inject(supabaseAuth);
  router = inject(Router);
  isVisible = signal<boolean>(true);
  mode = signal<string>('onboarding');
  user = signal<User | null>(null);
  locationSelected = signal<any | null>(null);
  passwordToSet = signal<string | null>(null);
  updatedUser = signal<User | null>(null);
  private hasLoadedUser = false;
  private hasSaved = false;

  constructor() {
    effect(() => {
      const u = this.updatedUser();
      const p = this.passwordToSet();
      const l = this.locationSelected();
      if (u && p && l && !this.hasSaved) {
        this.hasSaved = true;
        const finalUser = {
          ...u,
          location: l,
        };
        this.saveAll(finalUser, p);
      }
    });
  }

  async ngOnInit() {
    const session = this.auth.sessionSignal();
    if (session?.user?.id && !this.hasLoadedUser) {
      this.hasLoadedUser = true;
      try {
        const user = await this.database.getUserById(session.user.id);
        this.user.set(user);
      } catch (error) {
        console.error(error);
        this.toast.showError('Error loading user');
      }
    }
  }

  onChangePasword(password: string) {
    this.passwordToSet.set(password);
  }

  async saveAll(user: User, password: string) {
    const newUser = {
      name: user.name,
      location: user.location,
      email: user.email,
    };
    try {
      await this.database.updateUserFromSelf(newUser as Partial<User>, this.user()!.id!);
      await this.auth.supabaseAuth.auth.updateUser({ password });

      this.toast.showSuccess('User updated successfully');
      this.router.navigate([getDashboardPathForRole(user.role_id)]);
    } catch (error: any) {
      console.error('Save error:', error);
      throw new AppError(error.code);
    }
  }

  onDialogSubmit(user: User) {
    this.updatedUser.set(user);
  }

  onSaveLocation(location: any) {
    this.locationSelected.set(location);
  }
}
