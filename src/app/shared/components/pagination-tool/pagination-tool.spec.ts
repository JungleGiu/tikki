import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationTool } from './pagination-tool';

describe('PaginationTool', () => {
  let component: PaginationTool;
  let fixture: ComponentFixture<PaginationTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationTool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationTool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
