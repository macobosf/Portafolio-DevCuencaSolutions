/**
 * @description Servicio singleton de autenticación que gestiona el estado del usuario
 * mediante Firebase Auth y determina el rol (programador / usuario externo) consultando Firestore.
 *
 * providedIn: 'root' garantiza una única instancia compartida en toda la app (patrón Singleton),
 * lo que permite que cualquier componente/guard lea el mismo estado reactivo sin duplicados.
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authInstance = inject(Auth);
  private readonly db = inject(Firestore);

  // ─── Signals de estado público ────────────────────────────────────────────
  // currentUser refleja el objeto User de Firebase; null cuando no hay sesión activa.
  readonly currentUser = signal<User | null>(null);

  // isLoading bloquea la UI hasta que onAuthStateChanged resuelva el estado inicial,
  // evitando flashes de contenido o redirecciones prematuras de los guards.
  readonly isLoading = signal<boolean>(true);

  // ─── Signals privados de rol ───────────────────────────────────────────────
  // Se mantienen privados para que solo este servicio los modifique; se exponen
  // como computed o asReadonly() para garantizar inmutabilidad desde el exterior.
  private readonly _isProgrammerUser = signal<boolean>(false);
  private readonly _programadorId = signal<string | null>(null);
  private readonly _userName = signal<string>('');

  // ─── Signals derivados (computed) ─────────────────────────────────────────
  // computed() crea valores derivados reactivos: se recalculan automáticamente solo
  // cuando cambia algún signal del que dependen, sin lógica adicional en los componentes.
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isProgrammer = computed(() => this._isProgrammerUser());

  // isExternalUser: usuario logueado que NO es programador (cliente / empresa)
  readonly isExternalUser = computed(
    () => this.isAuthenticated() && !this._isProgrammerUser(),
  );

  // asReadonly() expone el signal sin el método .set(), previniendo mutaciones externas
  readonly programadorId = this._programadorId.asReadonly();
  readonly userName = this._userName.asReadonly();

  constructor() {
    // onAuthStateChanged se suscribe al ciclo de vida de la sesión de Firebase.
    // Se coloca en el constructor para que se active desde el momento en que el
    // servicio es instanciado (carga de la app), garantizando que el estado esté
    // disponible antes de que cualquier componente lo consuma.
    onAuthStateChanged(this.authInstance, async (user) => {
      this.isLoading.set(true);
      this.currentUser.set(user);
      try {
        if (user) {
          // ─── Consulta de rol en Firestore ──────────────────────────────────
          // Se busca el email del usuario en la colección 'programadores'.
          // Si existe un documento con ese email, el usuario es un programador
          // registrado en la plataforma; de lo contrario es un usuario externo.
          const q = query(
            collection(this.db, 'programadores'),
            where('email', '==', user.email),
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            // ─── Rama: usuario es programador ─────────────────────────────
            this._isProgrammerUser.set(true);
            // Se guarda el ID del documento Firestore (no el UID de Firebase Auth),
            // ya que este ID se usa para filtrar proyectos y solicitudes en Strapi/Firestore.
            this._programadorId.set(snap.docs[0].id);
            this._userName.set(
              (snap.docs[0].data()['nombre'] as string) ||
                user.displayName ||
                user.email ||
                '',
            );
          } else {
            // ─── Rama: usuario externo ─────────────────────────────────────
            this._isProgrammerUser.set(false);
            this._programadorId.set(null);
            // Se consulta la colección 'usuarios' para obtener el nombre guardado
            // en el registro; si no existe el doc, se usa el displayName de Google Auth.
            const userDoc = await getDoc(doc(this.db, 'usuarios', user.uid));
            if (userDoc.exists()) {
              this._userName.set(
                (userDoc.data()['nombre'] as string) ||
                  user.displayName ||
                  user.email ||
                  '',
              );
            } else {
              this._userName.set(user.displayName || user.email || '');
            }
          }
        } else {
          // ─── Sin sesión activa: resetear todo el estado de rol ────────────
          this._isProgrammerUser.set(false);
          this._programadorId.set(null);
          this._userName.set('');
        }
      } finally {
        // finally asegura que isLoading se ponga en false incluso si ocurre un error,
        // evitando que la app quede en un estado de carga infinita.
        this.isLoading.set(false);
      }
    });
  }

  /**
   * @description Retorna el nombre visible del usuario autenticado.
   */
  getUserName(): string {
    return this._userName();
  }

  /**
   * @description Retorna el rol del usuario como string literal para lógica condicional en plantillas.
   * @returns 'programador' | 'usuario' | null si no hay sesión
   */
  getUserRole(): 'programador' | 'usuario' | null {
    if (!this.isAuthenticated()) return null;
    return this._isProgrammerUser() ? 'programador' : 'usuario';
  }

  /**
   * @description Registra un nuevo usuario externo con email/contraseña.
   * Crea el perfil en Firebase Auth y guarda el documento en la colección 'usuarios' de Firestore
   * con rol 'usuario' para diferenciarlo de los programadores.
   */
  async registerWithEmail(
    email: string,
    password: string,
    nombre: string,
  ): Promise<void> {
    const credential = await createUserWithEmailAndPassword(
      this.authInstance,
      email,
      password,
    );
    const { uid } = credential.user;
    // updateProfile sincroniza el displayName en Firebase Auth para usos futuros (ej: Google login)
    await updateProfile(credential.user, { displayName: nombre });
    await setDoc(doc(this.db, 'usuarios', uid), {
      uid,
      nombre,
      email,
      rol: 'usuario',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * @description Autentica un usuario registrado con email y contraseña.
   * onAuthStateChanged se encargará de actualizar el estado reactivo al completarse.
   */
  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.authInstance, email, password);
  }

  /**
   * @description Inicia sesión mediante popup de Google OAuth.
   * Si el usuario no existe en Firestore, el rol quedará como 'usuario' por defecto
   * (onAuthStateChanged no encontrará su email en 'programadores').
   */
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.authInstance, provider);
  }

  /**
   * @description Cierra la sesión activa en Firebase Auth.
   * onAuthStateChanged emitirá null y limpiará todos los signals de estado.
   */
  async logout(): Promise<void> {
    await signOut(this.authInstance);
  }
}
