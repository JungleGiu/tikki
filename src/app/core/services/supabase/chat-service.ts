import { Injectable } from '@angular/core';
import { Chat, ChatMessage } from '../../models/chat';
import { supabase } from './supabase-client';
import { SendMessageDTO } from '../../../shared/components/chat-open/open-chat';
import { RealtimeChannel } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  /**
   * Get all chats for a user (where they're creator or assignee)
   */
  async getUserChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
      .is('archived_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
    return data || [];
  }

  async getChatByTicketId(ticketId: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('ticket_ref', ticketId)
      .is('archived_at', null)
      .single();

    if (error) {
      console.error('Error fetching chat:', error);
      return null;
    }
    return data;
  }

  /*
   * Get all messages for a chat
   */
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  }

  async getLastMessagePreview(chat: Chat): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching last message preview:', error);
    }
    return data as ChatMessage;
  }
  /**
   * Send a message to a chat
   */
  async sendMessage({ chatId, senderId, message }: SendMessageDTO): Promise<ChatMessage | null> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          chat_id: chatId,
          sender_id: senderId,
          message: message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }
    return data;
  }

  /**
   * Subscribe to real-time chat messages
   */
  subscribeToChatMessages(chatId: string, callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Unsubscribe from chat messages
   */
  unsubscribeFromChat(subscription: RealtimeChannel) {
    supabase.removeChannel(subscription);
  }

  subscribeToChatsUpdates(callback: (chat: Chat) => void) {
    const subscription = supabase
      .channel('chats-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          callback(payload.new as Chat);
        }
      )
      .subscribe();

    return subscription;
  }

    unsubscribeFromChatsUpdates(subscription: RealtimeChannel) {
    supabase.removeChannel(subscription);
  }
}
