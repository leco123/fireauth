import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './User';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
    ) { }

  register(user: User): Observable<boolean> {
    // from tranforma o retorno em observable rxjs
    return from(this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password))
      .pipe(
        switchMap((u: firebase.auth.UserCredential) => 
          // u.user.uid gerado pelo firebase
          this.userCollection.doc(u.user.uid) // gravando na base de dados
            .set({...user, id: u.user.uid})   // retornando promise
            .then(()=>true)                   // informando que deu tudo ok
        ),
        catchError((err)=> throwError(err))
      )
  }

  login(email: string, password: string): Observable<User> {
    return from(this.afAuth.auth
      .signInWithEmailAndPassword(email, password))
      .pipe(
          switchMap((u: firebase.auth.UserCredential) => this.userCollection
          .doc<User>(u.user.uid) // utiliza a chave para retornar usuário
          .valueChanges()),
          catchError(()=> throwError('Invalid credentials or user is not registered.'))
      )
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
