// import { Injectable } from "@angular/core";
// import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup,GoogleAuthProvider} from '@angular/fire/auth';



// @Injectable({
//     providedIn:'root'
// })

// export class UserService{
//  constructor(private auth: Auth){}

// register({email, password} : any){

//     return createUserWithEmailAndPassword(this.auth, email,password);
// }

// login({email, password} : any){

//     return signInWithEmailAndPassword(this.auth, email,password);
// }

// loginWithGoogle(){
// return signInWithPopup(this.auth,new GoogleAuthProvider()); 

// }

// logout(){
//     return signOut(this.auth);
// }
// }


// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, signInWithRedirect } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  loginWithGoogle(){
    //return signInWithRedirect(this.auth,new GoogleAuthProvider());
 return signInWithPopup(this.auth,new GoogleAuthProvider()); 
}

register({email, password} : any){

    return createUserWithEmailAndPassword(this.auth, email,password);
}
}











