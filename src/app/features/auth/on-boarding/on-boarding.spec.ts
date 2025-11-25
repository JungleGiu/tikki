import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoarding } from './on-boarding';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OnBoarding', () => {
  let component: OnBoarding;
  let fixture: ComponentFixture<OnBoarding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnBoarding],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OnBoarding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
