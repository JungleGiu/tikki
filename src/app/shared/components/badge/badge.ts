import { Component, Input } from '@angular/core';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
@Component({
  selector: 'app-badge',
  imports: [DepartmentPipePipe],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {

@Input ({required: true}) variant :string = ''
}
