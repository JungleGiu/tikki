import { Component, Input, Output , EventEmitter,signal} from '@angular/core';

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [],
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss',
})
export class ConfirmDeleteDialog {
@Input() item : string = '';
@Input() id : string = '';
@Output() confirm = new EventEmitter<string>();
@Output() cancel = new EventEmitter<void>();


}
