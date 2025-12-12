import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'departmentPipe'
})
export class DepartmentPipe implements PipeTransform {
private departments: { [key: number]: string } = {
  1: 'IT',
  2: 'HR',
  3: 'Sales',
  4: 'Marketing'
}
  transform(id:number): string {
    return this.departments[id] || 'Unknown';
  }

}
