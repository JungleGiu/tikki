import { Injectable } from '@angular/core';
import { ToastService} from 'ngx-toastr-notifier'
@Injectable({
  providedIn: 'root',
})
export class ToastAppService {
 
constructor(private toastService: ToastService) {}

config : any = {
  duration: 5000,
  showClose: false,
  horizontalPosition: 'right',
  verticalPosition: 'bottom',
}
showSuccess(message: string) {
  this.toastService.success(message, 'Success', this.config);
}
showWarning(message: string) {
  this.toastService.warning(message, 'Warning', this.config);
}
showInfo(message: string) {
  this.toastService.info(message, 'Info', this.config);
}
showError(message: string) {
  this.toastService.error(message, 'Error', this.config);
}

}
