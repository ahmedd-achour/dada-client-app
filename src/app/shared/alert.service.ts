import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

const BRAND = {
  confirmButtonColor: '#7a4a28',
  cancelButtonColor: '#8a7565',
};

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string, title = 'C\'est fait !'): void {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: BRAND.confirmButtonColor,
      timer: 2200,
      timerProgressBar: true,
    });
  }

  error(message: string, title = 'Oups'): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: BRAND.confirmButtonColor,
    });
  }

  toast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    });
  }

  async confirm(title: string, text: string, confirmLabel = 'Confirmer'): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmLabel,
      cancelButtonText: 'Annuler',
      confirmButtonColor: BRAND.confirmButtonColor,
      cancelButtonColor: BRAND.cancelButtonColor,
      reverseButtons: true,
    });
    return result.isConfirmed;
  }

  async confirmDanger(title: string, text: string, confirmLabel: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'error',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmLabel,
      cancelButtonText: 'Retour',
      confirmButtonColor: '#c0472f',
      cancelButtonColor: BRAND.cancelButtonColor,
      reverseButtons: true,
    });
    return result.isConfirmed;
  }
}
