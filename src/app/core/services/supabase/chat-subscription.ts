import { Injectable , inject} from '@angular/core';
import { ChatService } from './chat-service';
import { Chat
} from '../../models/chat';
import { RealtimeChannel } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class ChatSubscription {
  private chatService = inject(ChatService);
  private chatSubscription: RealtimeChannel | null = null;
  private callbacks: ((chat: Chat) => void)[] = [];

  initializeSubscription(): void {
    if (this.chatSubscription) return;
    this.chatSubscription = this.chatService.subscribeToChatsUpdates((updatedChat: Chat) => {
      this.callbacks.forEach((callback) => callback(updatedChat));
    });
  }

  subscribe(callback: (chat: Chat) => void): void {
    this.callbacks.push(callback);
    if (!this.chatSubscription) {
      this.initializeSubscription();
    }
  }

  unsubscribe(callback: (chat: Chat) => void): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    if (this.callbacks.length === 0) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    if (this.chatSubscription) {
      this.chatService.unsubscribeFromChatsUpdates(this.chatSubscription);
      this.chatSubscription = null;
    }
  }
}
