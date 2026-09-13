import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { FLEET_MODELS } from './vehicle-inventory';

const FLEET_COLLECTION = 'fleets';

export interface FleetVehicleDoc {
  id: string;
  brand: string;
  model: string;
  year: number;
  bodyType: string;
  gamme: 'Standard' | 'Luxe' | '7 Places' | 'Pickup';
  seats: number;
  fuel: 'Essence' | 'Diesel';
  transmission: string;
  unitCount: number;
  image: string;
  dailyFrom: number;
  /** Preset passed to the booking modal / vehicle-picker (must match a FLEET_CATEGORIES name). */
  bookingCategory: string;
  /** Visibility control — this collection is never hard-deleted, only hidden from the public site. */
  isPublic: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export type FleetVehicleInput = Omit<FleetVehicleDoc, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable({ providedIn: 'root' })
export class FleetService {
  /** All fleet vehicles, public and hidden — admin "Gérer la flotte" view. */
  watchFleet(): Observable<FleetVehicleDoc[]> {
    return new Observable<FleetVehicleDoc[]>((subscriber) => {
      const q = query(collection(db, FLEET_COLLECTION), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          subscriber.next(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FleetVehicleDoc)));
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  /** Public-facing vehicles only — used by the client-side fleet showcase. */
  watchPublicFleet(): Observable<FleetVehicleDoc[]> {
    return new Observable<FleetVehicleDoc[]>((subscriber) => {
      const q = query(collection(db, FLEET_COLLECTION), where('isPublic', '==', true), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          subscriber.next(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FleetVehicleDoc)));
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  async getVehicle(id: string): Promise<FleetVehicleDoc | null> {
    const snap = await getDoc(doc(db, FLEET_COLLECTION, id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as FleetVehicleDoc) : null;
  }

  async createVehicle(input: FleetVehicleInput): Promise<string> {
    const now = Date.now();
    const ref = await addDoc(collection(db, FLEET_COLLECTION), { ...input, createdAt: now, updatedAt: now });
    return ref.id;
  }

  async updateVehicle(id: string, input: Partial<FleetVehicleInput>): Promise<void> {
    await updateDoc(doc(db, FLEET_COLLECTION, id), { ...input, updatedAt: Date.now() });
  }

  async setVisibility(id: string, isPublic: boolean): Promise<void> {
    await updateDoc(doc(db, FLEET_COLLECTION, id), { isPublic, updatedAt: Date.now() });
  }

  /** One-time bootstrap: only writes if the collection is empty, so it's safe to call from
   *  ngOnInit on every visit to the admin fleet page without ever clobbering real edits. */
  async seedIfEmpty(): Promise<void> {
    const existing = await getDocs(query(collection(db, FLEET_COLLECTION)));
    if (!existing.empty) return;

    const batch = writeBatch(db);
    const now = Date.now();
    FLEET_MODELS.forEach((model, index) => {
      const transmissions = Array.from(new Set(model.units.map((u) => u.transmission))).join(' / ');
      const ref = doc(collection(db, FLEET_COLLECTION));
      const input: FleetVehicleInput = {
        brand: model.brand,
        model: model.model,
        year: model.year,
        bodyType: model.bodyType,
        gamme: model.gamme,
        seats: model.seats,
        fuel: model.fuel,
        transmission: transmissions,
        unitCount: model.units.length,
        image: model.image,
        dailyFrom: model.dailyFrom,
        bookingCategory: model.bookingCategory,
        isPublic: true,
        order: index,
      };
      batch.set(ref, { ...input, createdAt: now, updatedAt: now });
    });
    await batch.commit();
  }
}
