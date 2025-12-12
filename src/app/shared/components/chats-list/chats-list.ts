import { Component, inject, signal, EventEmitter, Output, Input, effect } from '@angular/core';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { Chat, ChatMessage } from '../../../core/models/chat';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { UserNamePipe } from '../../pipes/user-name-pipe';
@Component({
  selector: 'app-chats-list',
  imports: [UserNamePipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss',
})
export class ChatsList {
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  @Input() chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  @Output() chatSelectedEvent = new EventEmitter<{ chat: Chat; userId: string }>();
  lastMessagesLoaded = signal<ChatMessage[]>([]);

  constructor() {
    effect(() => {
      const currentChats = this.chats();
      if (currentChats.length > 0) {
        this.loadLastMessages(currentChats);
      }
    });
  }

  toOrFrom(chat: Chat): string {
    const currentUserId = this.supabaseAuth.authUser()?.id;
    if (chat.created_by === currentUserId) {
      return chat.assigned_to;
    } else {
      return chat.created_by;
    }
  }

  chatSelected(chat: Chat, userId: string) {
    this.selectedChat.set(chat);
    this.chatSelectedEvent.emit({ chat, userId });
  }

  getLastMessageText(chat: Chat): string {
    const lastMessage = this.lastMessagesLoaded().find((m) => m.chat_id === chat.id);
    return lastMessage?.message || '';
  }

  private async loadLastMessages(chats: Chat[]): Promise<void> {
    const lastMessages: ChatMessage[] = [];
    for (const chat of chats) {
      const lastMessage = await this.chatService.getLastMessagePreview(chat);
      if (lastMessage) {
        lastMessages.push(lastMessage);
      }
    }
    this.lastMessagesLoaded.set(lastMessages);
  }
}
