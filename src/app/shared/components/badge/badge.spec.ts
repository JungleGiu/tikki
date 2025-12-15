import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Badge } from './badge';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Badge', () => {
  let component: Badge;
  let fixture: ComponentFixture<Badge>;
  let variant: string;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
      providers: [provideZonelessChangeDetection()],

    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
    variant = 'HR';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
