/**
 * @description Servicio singleton de acceso a Firestore para operaciones sobre
 * la colección 'solicitudes' (contact requests).
 *
 * Centraliza toda la lógica de persistencia en Firestore para mantener los
 * componentes libres de detalles de acceso a datos.
 */
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

  /**
   * @description Crea una nueva solicitud de contacto en Firestore y retorna el ID generado.
   * Se usa addDoc (auto-ID) para que Firestore asigne un ID único sin colisiones.
   */
  async crearSolicitud(
    solicitud: Omit<ContactRequest, 'id'>,
  ): Promise<string> {
    const ref = await addDoc(
      collection(this.db, 'solicitudes'),
      solicitud,
    );
    return ref.id;
  }

  /**
   * @description Retorna un Observable en tiempo real de las solicitudes asignadas a un programador.
   *
   * collectionData() mantiene la suscripción al WebSocket de Firestore: cualquier cambio
   * en la colección (nuevo doc, actualización) emite automáticamente sin polling manual.
   * orderBy('fechaCreacion', 'desc') muestra las solicitudes más recientes primero.
   */
  obtenerSolicitudesPorProgramador(
    programadorId: string,
  ): Observable<ContactRequest[]> {
    const q = query(
      collection(this.db, 'solicitudes'),
      // Filtra solo las solicitudes dirigidas a este programador
      where('programadorId', '==', programadorId),
      // Ordena descendente para mostrar las más recientes en la parte superior
      orderBy('fechaCreacion', 'desc'),
    );
    // idField: 'id' inyecta el ID del documento Firestore como propiedad 'id' del objeto
    return collectionData(q, { idField: 'id' }) as Observable<
      ContactRequest[]
    >;
  }

  /**
   * @description Retorna un Observable en tiempo real de las solicitudes enviadas por un usuario.
   * Permite al usuario externo hacer seguimiento de sus propias solicitudes.
   */
  obtenerSolicitudesPorUsuario(uid: string): Observable<ContactRequest[]> {
    const q = query(
      collection(this.db, 'solicitudes'),
      // Filtra por el UID de Firebase Auth del solicitante
      where('uid', '==', uid),
      orderBy('fechaCreacion', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<
      ContactRequest[]
    >;
  }

  /**
   * @description Actualiza parcialmente el estado y/u observación de una solicitud existente.
   * Se usa updateDoc (patch parcial) en lugar de setDoc para no sobrescribir otros campos.
   */
  async actualizarSolicitud(
    id: string,
    datos: Partial<Pick<ContactRequest, 'estado' | 'observacion'>>,
  ): Promise<void> {
    await updateDoc(doc(this.db, 'solicitudes', id), datos);
  }
}
