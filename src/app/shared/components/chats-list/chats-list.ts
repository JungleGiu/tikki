import { Component, inject, OnInit, signal, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { Chat } from '../../../core/models/chat';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { UserNamePipe } from '../../pipes/user-name-pipe';
@Component({
  selector: 'app-chats-list',
  imports: [UserNamePipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss',
})
export class ChatsList implements OnInit {
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  @Output() chatSelectedEvent = new EventEmitter<{ chat: Chat; userId: string }>();
ngOnInit(): void {
  this.chatService.getUserChats(this.supabaseAuth.authUser()?.id ?? '').then((chats) => {
    this.chats.set(chats);
  });
}

toOrFrom( chat: Chat): string {
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
lastMessagePreview(chat: Chat): string {
  // Placeholder for last message preview logic
  return 'Last message preview...';
}
}