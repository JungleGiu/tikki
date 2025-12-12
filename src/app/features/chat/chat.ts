import { Component, OnInit, signal, inject } from '@angular/core';
import { Chat } from '../../core/models/chat';
import { ChatService } from '../../core/services/supabase/chat-service';
import { ChatsList } from '../../shared/components/chats-list/chats-list';
import { OpenChat } from '../../shared/components/chat-open/open-chat';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { Ticket } from '../../core/models/ticket';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat',
  imports: [ChatsList, OpenChat],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatPage implements OnInit {
  selectedChat = signal<Chat | null>(null);
  toUserId = signal<string | null>(null);
  chats = signal<Chat[]>([]);
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  activatedRoute = inject(ActivatedRoute);
  relatedTicket = signal<Ticket | null>(null);
  ngOnInit(): void {
    this.chatService.getUserChats(this.supabaseAuth.authUser()?.id ?? '').then((chats) => {
      this.chats.set(chats);

      const navigationState = window.history.state;
      if (navigationState?.chatId) {
        const selectedChat = chats.find((chat) => chat.id === navigationState.chatId);
        if (selectedChat) {
          this.selectedChat.set(selectedChat);
        }
      }
    });
  }
  onChatSelected({
    chat,
    userId,
    relatedTicket,
  }: {
    chat: Chat;
    userId: string;
    relatedTicket: Ticket | null;
  }) {
    this.selectedChat.set(chat);
    this.toUserId.set(userId);
    this.relatedTicket.set(relatedTicket);
  }
}
