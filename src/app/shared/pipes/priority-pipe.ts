import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority'
})
export class PriorityPipe implements PipeTransform {

  private priority: { [key: number]: string } = {
   
    1: 'Critical',
    2: 'High',
    3: 'Medium',
    4: 'Low'
  }
  transform(grade: number): string {
    return this.priority[grade] || 'Unknown';
  }


}
