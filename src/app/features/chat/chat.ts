import { Component, signal } from '@angular/core';
import { Chat } from '../../core/models/chat';
import { ChatService } from '../../core/services/supabase/chat-service';
import { ChatsList } from '../../shared/components/chats-list/chats-list';
import { OpenChat } from '../../shared/components/chat-open/open-chat';
@Component({
  selector: 'app-chat',
  imports: [ChatsList, OpenChat],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatPage {
selectedChat = signal<Chat | null>(null);
toUserId = signal<string | null>(null);
onChatSelected({chat, userId}: {chat: Chat, userId: string}) {
  this.selectedChat.set(chat);
  this.toUserId.set(userId);
}
}