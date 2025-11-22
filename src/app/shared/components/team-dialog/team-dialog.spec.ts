import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDialog } from './team-dialog';

describe('TeamDialog', () => {
  let component: TeamDialog;
  let fixture: ComponentFixture<TeamDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
