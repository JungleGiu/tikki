import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoarding } from './on-boarding';

describe('OnBoarding', () => {
  let component: OnBoarding;
  let fixture: ComponentFixture<OnBoarding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnBoarding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnBoarding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
