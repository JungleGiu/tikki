import { TestBed } from '@angular/core/testing';

import { ChatSubscription } from './chat-subscription';

describe('ChatSubscription', () => {
  let service: ChatSubscription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSubscription);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
