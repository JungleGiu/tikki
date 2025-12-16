import { Component, effect, Input, signal, inject, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Chat, ChatMessage } from '../../../core/models/chat';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { FormsModule } from '@angular/forms';
import { TicketDetails } from '../ticket-details/ticket-details';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { DepartmentPipe } from '../../pipes/department-pipe';
import { Ticket } from '../../../core/models/ticket';
import { Badge } from '../badge/badge';
import { AppError } from '../../../core/services/errors/app-error';
export type SendMessageDTO = {
  chatId: string;
  senderId: string;
  message: string;
};
@Component({
  selector: 'app-open-chat',
  imports: [UserNamePipe, FormsModule, TicketDetails, Badge, PriorityPipe, DepartmentPipe],
  templateUrl: './open-chat.html',
  styleUrl: './open-chat.scss',
})
export class OpenChat implements OnDestroy{
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @Input() chat = signal<Chat | null>(null);
  @Input() toUserId = signal<string | null>(null);
  @Input() relatedTicket = signal<Ticket | null>(null);
  @Output() newMessageEvent = new EventEmitter<SendMessageDTO>();
  chatMessages = signal<ChatMessage[]>([]);
  chatService = inject(ChatService);
  supabaseAuth = inject(supabaseAuth);
  message = signal<string>('');
  subscription: any;
  ticketDetailsVisible = signal<boolean>(false);
  viewTicketDetails = signal<'view' | 'edit' | 'create'>('view');

  constructor() {
    effect(() => {
      const chat = this.chat();
 if (this.subscription) {
    this.chatService.unsubscribeFromChat(this.subscription);
    this.subscription = null;
  }

  if (chat) {
    this.chatService.getChatMessages(chat.id).then((messages) => {
      this.chatMessages.set(messages);
    });
    this.subscription = this.chatService.subscribeToChatMessages(chat.id, (newMessage) => {
      // Filter to only this chat
      if (newMessage.chat_id === chat.id) {
        this.chatMessages.set([...this.chatMessages(), newMessage]);
      }
    });
  } else {
    this.chatMessages.set([]);
  }
    });
       effect(() => {
        this.chatMessages();
       requestAnimationFrame(() => {
        this.scrollToLatest();
       });
    });
  }

  
  private scrollToLatest(): void {
  try {
    if (this.messageContainer?.nativeElement) {
      const element = this.messageContainer.nativeElement;
      const lastMessage = element.lastElementChild;
      
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  } catch (error) {
    throw new AppError(error instanceof AppError ? error.code : 'UNKNOWN');
  }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.chatService.unsubscribeFromChat(this.subscription);
    }
  }

  dynamicMessageClass(message: ChatMessage): string {
    const currentUserId = this.supabaseAuth.authUser()?.id;
    return message.sender_id === currentUserId ? 'sent' : 'received';
  }

  async onSend(messageText: string) {
    if (!messageText.trim()) return;

    const message: SendMessageDTO = {
      chatId: this.chat()?.id ?? '',
      senderId: this.supabaseAuth.authUser()?.id ?? '',
      message: messageText,
    };

    const sentMessage = await this.chatService.sendMessage(message);
    this.message.set('');
    if (sentMessage && this.chat()) {
      this.newMessageEvent.emit(message);
    }
  }

  openTicketDetails() {
    this.ticketDetailsVisible.set(!this.ticketDetailsVisible());
  }
}
