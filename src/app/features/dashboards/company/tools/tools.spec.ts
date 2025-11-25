import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tools } from './tools';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Tools', () => {
  let component: Tools;
  let fixture: ComponentFixture<Tools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tools],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tools);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
