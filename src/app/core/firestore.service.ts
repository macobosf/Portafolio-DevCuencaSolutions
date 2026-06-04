import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContactRequest } from './mock-data';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db = inject(Firestore);

  async crearSolicitud(
    solicitud: Omit<ContactRequest, 'id'>,
  ): Promise<string> {
    const ref = await addDoc(
      collection(this.db, 'solicitudes'),
      solicitud,
    );
    return ref.id;
  }

  obtenerSolicitudesPorProgramador(
    programadorId: string,
  ): Observable<ContactRequest[]> {
    const q = query(
      collection(this.db, 'solicitudes'),
      where('programadorId', '==', programadorId),
      orderBy('fechaCreacion', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<
      ContactRequest[]
    >;
  }

  obtenerSolicitudesPorUsuario(uid: string): Observable<ContactRequest[]> {
    const q = query(
      collection(this.db, 'solicitudes'),
      where('uid', '==', uid),
      orderBy('fechaCreacion', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<
      ContactRequest[]
    >;
  }

  async actualizarSolicitud(
    id: string,
    datos: Partial<Pick<ContactRequest, 'estado' | 'observacion'>>,
  ): Promise<void> {
    await updateDoc(doc(this.db, 'solicitudes', id), datos);
  }
}
