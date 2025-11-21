import {  inject, Injectable } from '@angular/core';
import { ToastAppService } from '../toast/toast-service';
import { AppError } from './app-error';
import { ErrorMapping } from './error-mapping';
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler {
  private toast = inject(ToastAppService);
  private errorMapper = inject(ErrorMapping);

  handleError(error: any): void {
    console.error(error);

    if (error instanceof AppError) {
      const message = this.errorMapper.getUserError(error.code);
      this.toast.showError(message);
      return;
    }

    
    this.toast.showError('Something went wrong, try again.');
  }
}
