import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  save(data: any, path: string) {
    const col = collection(this.firestore, path);
    return addDoc(col, data);
  }

  get(path: string): Observable<any[]> {
    const col = collection(this.firestore, path);
    return collectionData(col);
  }

  async getUserCredits(userId: string): Promise<number> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData['credits'] || 0;
    } else {
      return 0;
    }
  }

  async getUserData(userId: string): Promise<any> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return {};
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await deleteDoc(userDoc);
  }

  async updateUserCredits(userId: string, credits: number): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { credits }, { merge: true });
  }

  async updateUserScannedBarcodes(userId: string, scannedBarcodes: { [key: string]: number }): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { scannedBarcodes }, { merge: true });
  }
}
