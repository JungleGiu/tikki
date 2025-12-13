import { Component, effect, inject, Input ,signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { RolePipe } from '../../pipes/role-pipe';
import { User } from '../../../core/models/user';
import { Feature } from '../../../layout/auth-layout/auth-layout';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { Chat } from '../../../core/models/chat';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, RolePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(supabaseAuth);
  router = inject(Router);
  @Input() user: User | null = null;
  @Input() featuresRoutes: Feature[] = [];
  chatService = inject(ChatService);
  isUnread = signal<boolean>(false);
  currentUrl = toSignal(this.router.events);
  constructor() {
    this.chatService.subscribeToChatsUpdates((hasUnread: Chat) => {
      if (hasUnread && !this.isActive()) {
        this.isUnread.set(true);
    
      }
    });
    effect(() => {
        this.currentUrl(); // Track route changes
      if (this.isActive()) {
        this.isUnread.set(false);
      }
    })
  }


  isActive() {
    return this.router.url.includes('/chat');
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
