import { Injectable } from '@angular/core';
import { Chat, ChatMessage } from '../../models/chat';
import { supabase } from './supabase-client';

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

  /**
   * Send a message to a chat
   */
  async sendMessage(
    chatId: string,
    senderId: string,
    message: string
  ): Promise<ChatMessage | null> {
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
  unsubscribeFromChat(subscription: any) {
    supabase.removeChannel(subscription);
  }
}
