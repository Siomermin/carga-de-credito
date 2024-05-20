import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isSupported = false;

  public loggedUser?: any = JSON.parse(localStorage.getItem('loggedUser')!);
  barcodes: Barcode[] = [];
  totalCredits = 0;

  private barcodeCredits: { [key: string]: number } = {
    '8c95def646b6127282ed50454b73240300dccabc': 10,
    'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ': 50,
    '2786f4877b9091dcad7f35751bfcf5d5ea712b2f': 100
  };

  constructor() {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    }).catch(error => {
      this.toastService.presentToast('Error checking support: ' + error.message, 'middle', 'danger');
    });
  }

  async scan(): Promise<void> {
    try {
      const granted = await this.requestPermissions();

      if (!granted) {
        this.toastService.presentToast('No dio permisos', 'middle', 'danger');
        return;
      }

      const { barcodes } = await BarcodeScanner.scan();

      for (const barcode of barcodes) {
        this.barcodes.push(barcode);
        if (this.barcodeCredits[barcode.rawValue]) {
          this.totalCredits += this.barcodeCredits[barcode.rawValue];
          this.toastService.presentToast('Creditos agregados: ' + this.barcodeCredits[barcode.rawValue], 'middle', 'success');
        } else {
          this.toastService.presentToast('QR Desconocido: ' + barcode.rawValue, 'middle', 'danger');
        }
      }
    } catch (error: any) {
      this.toastService.presentToast('Error al escanear QR: ' + error.message, 'middle', 'danger');
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error: any) {
      this.toastService.presentToast('Error requesting permissions: ' + error.message, 'middle', 'danger');
      return false;
    }
  }

  logout() {
    this.authService.logout();
  }
}
