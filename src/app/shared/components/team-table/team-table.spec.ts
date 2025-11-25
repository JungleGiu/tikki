import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTable } from './team-table';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TeamTable', () => {
  let component: TeamTable;
  let fixture: ComponentFixture<TeamTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamTable],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
