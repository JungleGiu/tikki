import { Component, effect, Input, signal, inject, OnDestroy } from '@angular/core';
import { Chat, ChatMessage } from '../../../core/models/chat';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import {FormsModule} from '@angular/forms';

export type SendMessageDTO = {
  chatId: string;
  senderId: string;
  message: string;
};
@Component({
  selector: 'app-open-chat',
  imports: [UserNamePipe, FormsModule],
  templateUrl: './open-chat.html',
  styleUrl: './open-chat.scss',
})
export class OpenChat implements OnDestroy{
  @Input() chat = signal<Chat | null>(null);
  @Input() toUserId = signal<string | null>(null);
  chatMessages = signal<ChatMessage[]>([]);
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  message = signal<string>('');
  subscription: any;
  constructor() {
    effect(() => {
      const chat = this.chat();
      if (chat) {
        this.chatService.getChatMessages(chat.id).then((messages) => {
          this.chatMessages.set(messages);
        });
         this.subscription = this.chatService.subscribeToChatMessages(chat.id, (newMessage) => {
          this.chatMessages.set([...this.chatMessages(), newMessage]);
        });
      } else {
        this.chatMessages.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.chatService.unsubscribeFromChat(this.subscription);
    }
  }

  async onSend(messageText: string) {
       if (!messageText.trim()) return;

    const message: SendMessageDTO = {
      chatId: this.chat()?.id ?? '',
      senderId: this.supabaseAuth.authUser()?.id ?? '',
      message: messageText,
    };

    await this.chatService.sendMessage(message);
    this.message.set('');
  }
}
  

