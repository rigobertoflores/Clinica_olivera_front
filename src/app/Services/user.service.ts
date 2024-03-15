
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail  } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  register(email :string , password : string){
    return createUserWithEmailAndPassword(this.auth, email,password);
   }


   async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      // Guarda solamente la información necesaria del usuario en el almacenamiento local
      const user = {
        uid: result.user.uid,
        email: result.user.email,
        // cualquier otra información relevante que quieras almacenar
      };
      localStorage.setItem('user', JSON.stringify(user));
      console.log("Usuario logueado con Firebase", result);
      return true;
    } catch (error) {
      console.error('Error en el logging', error);
      return false;
    }
  }

   
  async loginWithGoogle(){ 
    try {   
    const result = await signInWithPopup(this.auth,new GoogleAuthProvider()); 
    localStorage.setItem('user', JSON.stringify(result.user));
    console.log("usuario logueado con google", result);
    return true;
  } catch (error) {
    console.error('Error logging in with Google', error);
    return false;
  }
}

isAuthenticated(): boolean {
  const user = localStorage.getItem('user');
  return !!user;
}

 // Método para enviar un correo de recuperación de contraseña
 async sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(this.auth, email);
    console.log('Correo de recuperación enviado.');
  } catch (error) {
    console.error('Error enviando el correo de recuperación', error);
  }
}
 
logout() {
  return from(signOut(this.auth).then(()=>{localStorage.removeItem('user');}));
}

}









