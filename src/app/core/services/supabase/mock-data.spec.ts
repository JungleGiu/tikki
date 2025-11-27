import { Session, User as SupabaseUser } from '@supabase/supabase-js';
export const mockSession: Session = {
  access_token: 'mock-access-token-123',
  refresh_token: 'mock-refresh-token-456',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: {
    id: '123',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {}
  } as SupabaseUser
};

export const mockAppUser = {
    id: '123',
    email: 'test@test.com',
    name: 'Test User',
    created_at: '2024-01-01T00:00:00Z',
    role_id: 1,
    department_id: 2
  };

  export const mockSupabaseUser: SupabaseUser = {
  id: '123',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  updated_at: '2024-01-01T00:00:00Z'
};
