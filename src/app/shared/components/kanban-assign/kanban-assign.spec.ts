import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanAssign } from './kanban-assign';

describe('KanbanAssign', () => {
  let component: KanbanAssign;
  let fixture: ComponentFixture<KanbanAssign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanAssign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanAssign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
