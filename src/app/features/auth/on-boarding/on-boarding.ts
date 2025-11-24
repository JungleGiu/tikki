import { Component, OnInit, signal, inject ,effect} from '@angular/core';
import { TeamDialog } from '../../../shared/components/team-dialog/team-dialog';
import { User } from '../../../core/models/user';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import { AppError } from '../../../core/services/errors/app-error';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Router } from '@angular/router';
@Component({
  selector: 'app-on-boarding',
  imports: [TeamDialog],
  templateUrl: './on-boarding.html',
  styleUrl: './on-boarding.scss',
})
export class OnBoarding implements OnInit {
isVisible = signal<boolean>(true);
mode = signal<string>('onboarding');
user = signal<User | null>(null);
locationSelected = signal<any | null>(null);
passwordToSet = signal<string | null>(null)
updatedUser = signal<User | null>(null)
toast = inject(ToastAppService)
database = inject(SupabaseDb)
auth = inject(supabaseAuth)
router = inject(Router)

ngOnInit(){
  effect(() => {
    const user = this.auth.appUser();
    if (user) {
      this.user.set(user); 
    }
  });
  effect(() => {
  const u = this.updatedUser();
  const p = this.passwordToSet();
  const l = this.locationSelected();

  if (u && p && l) {
    const finalUser = {
      ...u,
      location_id: l.id,
      location: l
    };


    this.saveAll(finalUser, p);
  }
});
}

saveAll(user: User, password: string) {
  this.database.updateUser(user, this.user()!.id!)
    .then(() => this.auth.supabaseAuth.auth.updateUser({ password }))
    .then(() => {
      this.toast.showSuccess('User updated successfully');
      this.router.navigate(['/dashboard']);
    })
    .catch((error) => {
      throw new AppError(error.code);
    })
}

onDialogSubmit(user: User) {
this.updatedUser.set(user)
}

 onSaveLocation(location: any) {
    this.locationSelected.set(location);
  }

onChangePasword( password: string) {
  this.passwordToSet.set(password)
} 
}

