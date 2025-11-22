import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTable } from './team-table';

describe('TeamTable', () => {
  let component: TeamTable;
  let fixture: ComponentFixture<TeamTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
