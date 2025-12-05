import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

private status: { [key: number]: string } = {
    0: 'Queued',
    1: 'Assigned',
    2: 'In Progress',
    3: 'Completed',
  }
  transform(grade: number): string {
    return this.status[grade] || 'Unknown';
  }

}
