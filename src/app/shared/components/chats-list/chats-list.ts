import {
  Component,
  inject,
  signal,
  EventEmitter,
  Output,
  Input,
  effect,
  computed,
} from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { Chat, ChatMessage } from '../../../core/models/chat';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Badge } from "../badge/badge";
import { DepartmentPipe } from '../../pipes/department-pipe';

@Component({
  selector: 'app-chats-list',
  imports: [UserNamePipe, Badge,  DepartmentPipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss',
})
export class ChatsList {
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  supabaseDb = inject(SupabaseDb);
  @Input() chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  @Output() chatSelectedEvent = new EventEmitter<{ chat: Chat; userId: string; relatedTicket: Ticket | null }>();
  lastMessagesLoaded = signal<ChatMessage[]>([]);
  sortedChats = computed(() => this.sortChatsByLastMessage());
  ticketRefsInfo = signal <Ticket[]>([]);
  constructor() {
    effect(() => {
      const currentChats = this.chats();
      if (currentChats.length > 0) {
        this.loadLastMessages(currentChats);
        this.loadTicketRefInfo(currentChats);
      }
    });

    effect(() => {
      const sorted = this.sortedChats();
      const ticketsLoaded = this.ticketRefsInfo().length > 0;
      if (sorted.length > 0 && ticketsLoaded && !this.selectedChat()) {
        const firstChat = sorted[0];
        this.chatSelected(firstChat, this.toOrFrom(firstChat));
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
    this.chatSelectedEvent.emit({ chat, userId , relatedTicket: this.getTicketRefInfo(chat)});
  }

  sortChatsByLastMessage(): Chat[] {
    const chatsWithLastMessage = this.chats().map((chat) => {
      const lastMessage = this.lastMessagesLoaded().find((m) => m.chat_id === chat.id);
      return {
        chat,
        lastMessageTime: lastMessage ? new Date(lastMessage.created_at) : new Date(0),
      };
    });
    chatsWithLastMessage.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
    return chatsWithLastMessage.map((item) => item.chat);
  }

  getLastMessageText(chat: Chat): string {
    const lastMessage = this.lastMessagesLoaded().find((m) => m.chat_id === chat.id);
    return lastMessage?.message || '';
  }

  getTicketRefInfo(chat: Chat): Ticket | null {
    const ticket = this.ticketRefsInfo().find(t => t.id === chat.ticket_ref);
    return ticket || null;
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
  private async loadTicketRefInfo(chats: Chat[]): Promise<void> {
   const ticketRefs = chats.map(chat => chat.ticket_ref);
  const tickets : Ticket[] = [];
   for (const ticketRef of ticketRefs) {
   const ticket = await this.supabaseDb.getTicketById(ticketRef);
    if (ticket) {
      tickets.push(ticket);
    }
   }
    this.ticketRefsInfo.set(tickets);
  }
}
