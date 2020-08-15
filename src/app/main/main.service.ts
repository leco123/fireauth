import { AngularFirestore } from '@angular/fire/fi';
import { Injectable } from '@angular/core';
import { Person } from './person';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  // Acessar Collection que deve acessar no firebase 
  private peoopleCollection: AngularFirestoreCollection<Person> = this.afs.collection('people');

  constructor(private afs: AngularFirestore) { }

  getPeople(): Observable<Person[]> {
    return this.peoopleCollection.valueChanges();
  }

  addPerson(p: Person){
    this.peoopleCollection.add(p);
  }
}
