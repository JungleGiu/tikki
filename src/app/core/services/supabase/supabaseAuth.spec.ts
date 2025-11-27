import { TestBed } from '@angular/core/testing';
import { supabaseAuth } from './supabaseAuth';
import { mockSession, mockSupabaseUser, mockAppUser } from './mock-data.spec';
import { provideZonelessChangeDetection } from '@angular/core';
import { supabase } from './supabase-client';
import { development } from '../../../../environments/env';

describe('supabaseAuth', () => {
  let service: supabaseAuth;

  // Mocks reali (NO TestBed provider – mock diretto)
  let mockAuth: any;
  let mockFrom: any;

  beforeEach(() => {
    // Reset completo dell’oggetto importato
    mockAuth = {
      getSession: jasmine.createSpy('getSession').and.returnValue(
        Promise.resolve({ data: { session: null }, error: null })
      ),

      onAuthStateChange: jasmine.createSpy('onAuthStateChange')
        .and.callFake((_event, cb) => cb('SIGNED_IN', mockSession)),

      signUp: jasmine.createSpy('signUp').and.returnValue(
        Promise.resolve({
          data: { user: mockSupabaseUser },
          error: null
        })
      ),

      signInWithPassword: jasmine.createSpy('signInWithPassword').and.returnValue(
        Promise.resolve({
          data: { user: mockSupabaseUser, session: mockSession },
          error: null
        })
      ),

      signOut: jasmine.createSpy('signOut').and.returnValue(
        Promise.resolve({ error: null })
      )
    };

    const mockEq = jasmine.createSpy('eq').and.returnValue({
      single: jasmine.createSpy('single').and.returnValue(
        Promise.resolve({ data: mockAppUser, error: null })
      )
    });

    mockFrom = jasmine.createSpy('from').and.callFake((table: string) => {
      if (table === 'users') {
        return {
          insert: jasmine.createSpy('insert').and.returnValue({
            select: jasmine.createSpy('select').and.returnValue({
              single: jasmine.createSpy('single').and.returnValue(
                Promise.resolve({ data: mockAppUser, error: null })
              )
            })
          }),
          select: jasmine.createSpy('select').and.returnValue({ eq: mockEq })
        };
      }
      return {};
    });

    // SIDE EFFECT: Modifica dell’oggetto importato (unica via possibile)
    (supabase as any).auth = mockAuth;
    (supabase as any).from = mockFrom;

    TestBed.configureTestingModule({
      providers: [supabaseAuth, provideZonelessChangeDetection()]
    });

    service = TestBed.inject(supabaseAuth);
  });

  // ───────────────────────────────────────────────────────────
  // BASIC CHECK
  // ───────────────────────────────────────────────────────────
  describe('SupabaseConfig', () => {
    it('should be initialized with the correct configuration', () => {
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
      expect(supabase.from).toBeDefined();
    });
  });

  describe('Environment', () => {
    it('should contain a valid supabase URL', () => {
      expect(development.supabase.authentication.SUPABASE_URL).toMatch(/^https:\/\/.*/);
      expect(development.supabase.authentication.SUPABASE_URL).toContain('supabase.co');
    });

    it('should contain a valid supabase key', () => {
      expect(development.supabase.authentication.SUPABASE_KEY).toBeDefined();
      expect(development.supabase.authentication.SUPABASE_KEY.length).toBeGreaterThan(20);
    });
  });

  // ───────────────────────────────────────────────────────────
  // INIT
  // ───────────────────────────────────────────────────────────
  describe('Initialization', () => {

    it('should initialize with correct session', () => {
      expect(service.sessionSignal()).toEqual(mockSession);
      expect(service.isInitialized()).toBeTrue();
    });

    it('should reflect the same id for session, authUser and appUser after init', () => {
      const sessionId = service.sessionSignal()?.user?.id;
      const authId = service.authUser()?.id;
      const appId = service.appUser()?.id;

      expect(sessionId).toBe('123');
      expect(authId).toBe('123');
      expect(appId).toBe('123');
    });

  });

  // ───────────────────────────────────────────────────────────
  // REGISTER FLOW
  // ───────────────────────────────────────────────────────────
  describe('Register', () => {

    it('should register user and auto-login with correct ids', async () => {
      const company = { email: 'test@example.com', password: 'password' } as any;

      await service.registerCompany(company, 'test@example.com', 'password');

      expect(service.authUser()?.id).toBe('123');
      expect(service.sessionSignal()?.user?.id).toBe('123');
      expect(service.appUser()?.id).toBe('123');

      expect(mockFrom).toHaveBeenCalledWith('users');
    });

  });

  // ───────────────────────────────────────────────────────────
  // LOGIN FLOW
  // ───────────────────────────────────────────────────────────
  describe('Login Admin', () => {

    it('should login admin and load profile', async () => {
      await service.logiAdmin('test@example.com', 'password');

      expect(service.authUser()?.id).toBe('123');
      expect(service.sessionSignal()?.user?.id).toBe('123');
      expect(service.appUser()?.id).toBe('123');

      expect(mockFrom).toHaveBeenCalledWith('users');
    });

  });

  // ───────────────────────────────────────────────────────────
  // LOGOUT FLOW
  // ───────────────────────────────────────────────────────────
  describe('Logout', () => {

    it('should clear authUser, session and appUser', async () => {

      await service.logout();

      expect(mockAuth.signOut).toHaveBeenCalled();

      expect(service.authUser()).toBeNull();
      expect(service.sessionSignal()).toBeNull();
      expect(service.appUser()).toBeNull();
    });

  });

});
