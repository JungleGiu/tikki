import {
  Component,
  inject,
  signal,
  EventEmitter,
  Output,
  Input,
  effect,
  computed,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { Chat, ChatMessage } from '../../../core/models/chat';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Badge } from '../badge/badge';
import { DepartmentPipe } from '../../pipes/department-pipe';
import { ChatSubscription } from '../../../core/services/supabase/chat-subscription';
@Component({
  selector: 'app-chats-list',
  imports: [UserNamePipe, Badge, DepartmentPipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss',
})
export class ChatsList implements OnChanges, OnDestroy {
  chatService = inject(ChatService);
  chatSubscription = inject(ChatSubscription);
  supabaseAuth = inject(supabaseAuth);
  supabaseDb = inject(SupabaseDb);
  @Input() chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  @Output() chatSelectedEvent = new EventEmitter<{
    chat: Chat;
    userId: string;
    relatedTicket: Ticket | null;
  }>();
  lastMessagesLoaded = signal<ChatMessage[]>([]);
  sortedChats = computed(() => this.sortChatsByLastMessage());
  ticketRefsInfo = signal<Ticket[]>([]);
  private chatUpdateCallback!: (chat: Chat) => void;
  constructor() {
    this.chatUpdateCallback = async (updatedChat: Chat) => {
      const currentChats = this.chats();
      const chatIndex = currentChats.findIndex((c) => c.id === updatedChat.id);

      if (chatIndex !== -1) {
        const updatedChats = [...currentChats];
        updatedChats[chatIndex] = updatedChat;
        this.chats.set(updatedChats);

        const message = await this.chatService.getLastMessagePreview(updatedChat);
        if (message) {
          const currentMessages = this.lastMessagesLoaded();
          const messageIndex = currentMessages.findIndex((m) => m.chat_id === updatedChat.id);

          if (messageIndex !== -1) {
            const updatedMessages = [...currentMessages];
            updatedMessages[messageIndex] = message;
            this.lastMessagesLoaded.set(updatedMessages);
          } else {
            this.lastMessagesLoaded.set([...currentMessages, message]);
          }
        }
      }
    };

    this.chatSubscription.subscribe(this.chatUpdateCallback);

    effect(async () => {
      const currentChats = this.chats();
      if (currentChats.length > 0) {
        await this.loadLastMessages(currentChats);
        await this.loadTicketRefInfo(currentChats);
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
  async ngOnChanges(): Promise<void> {
    const currentChats = this.chats();
    if (currentChats.length > 0) {
      await this.loadLastMessages(currentChats);
      await this.loadTicketRefInfo(currentChats);
    }
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe(this.chatUpdateCallback);
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
    this.chatSelectedEvent.emit({ chat, userId, relatedTicket: this.getTicketRefInfo(chat) });
  }

  sortChatsByLastMessage(): Chat[] {
    const sorted = [...this.chats()];
    sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return sorted;
  }

  getLastMessageText(chat: Chat): ChatMessage | undefined {
    const lastMessage = this.lastMessagesLoaded().find((m) => m.chat_id === chat.id);
    return lastMessage;
  }

  getTicketRefInfo(chat: Chat): Ticket | null {
    const ticket = this.ticketRefsInfo().find((t) => t.id === chat.ticket_ref);
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
    const ticketRefs = chats.map((chat) => chat.ticket_ref);
    const tickets: Ticket[] = [];
    for (const ticketRef of ticketRefs) {
      const ticket = await this.supabaseDb.getTicketById(ticketRef);
      if (ticket) {
        tickets.push(ticket);
      }
    }
    this.ticketRefsInfo.set(tickets);
  }
}
