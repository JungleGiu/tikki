import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenChat } from './open-chat';

describe('OpenChat', () => {
  let component: OpenChat;
  let fixture: ComponentFixture<OpenChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
