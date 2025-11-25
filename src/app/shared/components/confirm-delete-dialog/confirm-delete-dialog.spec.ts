import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ConfirmDeleteDialog', () => {
  let component: ConfirmDeleteDialog;
  let fixture: ComponentFixture<ConfirmDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteDialog],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
