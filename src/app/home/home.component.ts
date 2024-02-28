import { Component, inject } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../app.config';

@Component({
  standalone: true,
  selector: 'app-home',
  template: ` <p>Hello</p>
    <button (click)="start()">Start</button>`,
})
export default class HomeComponent {
  firestore = inject(FIRESTORE);

  start() {
    const playerCollection = collection(this.firestore, 'players');
    addDoc(playerCollection, { playerName: 'lol' });
  }
}
