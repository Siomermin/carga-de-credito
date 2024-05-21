import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastService } from '../shared/services/toast.service';
import { FirestoreService } from '../shared/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private firestoreService = inject(FirestoreService);
  public isLoading: boolean = false;

  isSupported = false;

  public loggedUser?: any = JSON.parse(localStorage.getItem('loggedUser')!);
  public profile: string = '';
  barcodes: Barcode[] = [];
  totalCredits = 0;

  private barcodeCredits: { [key: string]: number } = {
    '8c95def646b6127282ed50454b73240300dccabc': 10,
    'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ': 50,
    '2786f4877b9091dcad7f35751bfcf5d5ea712b2f': 100
  };

  private scannedBarcodes: { [key: string]: number } = {};

  constructor() {}

  async ngOnInit() {
    if (this.loggedUser) {
      const userEmail = this.loggedUser.email;
      const userProfile = this.authService.testUsers.find(user => user.email === userEmail)?.profile || 'usuario';
      this.profile = userProfile;

      this.totalCredits = await this.firestoreService.getUserCredits(this.loggedUser.uid);
      const userData = await this.firestoreService.getUserData(this.loggedUser.uid);
      this.scannedBarcodes = userData.scannedBarcodes || {};
    }
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
        if (this.barcodeCredits[barcode.rawValue]) {
          const credits = this.barcodeCredits[barcode.rawValue];
          const scannedCount = this.scannedBarcodes[barcode.rawValue] || 0;

          if (scannedCount === 0) {
            this.totalCredits += credits;
            this.toastService.presentToast('Créditos agregados: ' + credits, 'middle', 'success');
            this.scannedBarcodes[barcode.rawValue] = 1;
          } else if (scannedCount === 1 && this.profile === 'admin') {
            this.totalCredits += credits;
            this.scannedBarcodes[barcode.rawValue] = 2;
          } else if (scannedCount === 2 && this.profile === 'admin') {
            this.toastService.presentToast('No es posible agregar este crédito más de dos veces para el admin!', 'middle', 'danger');
          } else {
            this.toastService.presentToast('No es posible agregar este crédito más de una vez: ' + barcode.rawValue, 'middle', 'danger');
          }

          if (this.loggedUser) {
            await this.firestoreService.updateUserCredits(this.loggedUser.uid, this.totalCredits);
            await this.firestoreService.updateUserScannedBarcodes(this.loggedUser.uid, this.scannedBarcodes);
          }
        } else {
          this.toastService.presentToast('Crédito desconocido: ' + barcode.rawValue, 'middle', 'danger');
        }
      }
    } catch (error: any) {
      this.toastService.presentToast('Error al agregar crédito: ' + error.message, 'middle', 'danger');
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error: any) {
      this.toastService.presentToast('Error al pedir permisos: ' + error.message, 'middle', 'danger');
      return false;
    }
  }

  async resetCredits(): Promise<void> {
    try {
      this.totalCredits = 0;
      if (this.loggedUser) {
        await this.firestoreService.updateUserCredits(this.loggedUser.uid, this.totalCredits);
        this.toastService.presentToast('Se limpiaron los créditos!', 'middle', 'success');
      }
    } catch (error: any) {
      this.toastService.presentToast('Error al limpiar los créditos: ' + error.message, 'middle', 'danger');
    }
  }

  logout() {
    this.authService.logout();
  }
}
