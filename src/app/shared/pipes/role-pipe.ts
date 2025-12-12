import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolePipe'
})
export class RolePipe implements PipeTransform {

  private roles: { [key: number]: string } = {
    0: 'Company',
    1: 'Head of Department',
    2: 'User',
    3: 'Issuer',
  }
  transform(id: number): string {
    return this.roles[id] || 'Unknown';
  }

}
