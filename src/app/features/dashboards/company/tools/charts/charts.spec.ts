import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Charts } from './charts';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Charts', () => {
  let component: Charts;
  let fixture: ComponentFixture<Charts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Charts],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Charts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
