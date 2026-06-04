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

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal<boolean>(true);

  private readonly _isProgrammerUser = signal<boolean>(false);
  private readonly _programadorId = signal<string | null>(null);
  private readonly _userName = signal<string>('');

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isProgrammer = computed(() => this._isProgrammerUser());
  readonly isExternalUser = computed(
    () => this.isAuthenticated() && !this._isProgrammerUser(),
  );
  readonly programadorId = this._programadorId.asReadonly();
  readonly userName = this._userName.asReadonly();

  constructor() {
    onAuthStateChanged(this.authInstance, async (user) => {
      this.isLoading.set(true);
      this.currentUser.set(user);
      try {
        if (user) {
          const q = query(
            collection(this.db, 'programadores'),
            where('email', '==', user.email),
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            this._isProgrammerUser.set(true);
            this._programadorId.set(snap.docs[0].id);
            this._userName.set(
              (snap.docs[0].data()['nombre'] as string) ||
                user.displayName ||
                user.email ||
                '',
            );
          } else {
            this._isProgrammerUser.set(false);
            this._programadorId.set(null);
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
          this._isProgrammerUser.set(false);
          this._programadorId.set(null);
          this._userName.set('');
        }
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  getUserName(): string {
    return this._userName();
  }

  getUserRole(): 'programador' | 'usuario' | null {
    if (!this.isAuthenticated()) return null;
    return this._isProgrammerUser() ? 'programador' : 'usuario';
  }

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
    await updateProfile(credential.user, { displayName: nombre });
    await setDoc(doc(this.db, 'usuarios', uid), {
      uid,
      nombre,
      email,
      rol: 'usuario',
      createdAt: new Date().toISOString(),
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.authInstance, email, password);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.authInstance, provider);
  }

  async logout(): Promise<void> {
    await signOut(this.authInstance);
  }
}
