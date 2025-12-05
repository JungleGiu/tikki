import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCard } from './kanban-card';

describe('KanbanCard', () => {
  let component: KanbanCard;
  let fixture: ComponentFixture<KanbanCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
