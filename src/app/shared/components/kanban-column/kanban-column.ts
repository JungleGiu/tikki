import { Component, input, output } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanba-column',
  standalone: true,
  imports: [CdkDropList],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  title = input<string>('');
  drop = output<any>();
}
