import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../app.config';
import { addDoc, collection } from 'firebase/firestore';
import { Observable, Subject, defer, from, map, switchMap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { doc, docData } from 'rxfire/firestore';

export interface Room {
  uid: string;
  player1: string | null;
  player2: string | null;
}

export interface RoomState {
  room: Room | null;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  firestore = inject(FIRESTORE);

  //sources
  create$ = new Subject<string>();

  //state
  private state = signal<RoomState>({
    room: null,
  });

  //selectors
  room = computed(() => this.state().room);

  constructor() {
    connect(this.state).with(
      this.create$.pipe(
        switchMap((player1) => this.createRoom(player1)),
        map((room) => ({ room }))
      )
    );
  }

  private createRoom(player1: string) {
    const roomCollection = collection(this.firestore, 'rooms');
    return from(addDoc(roomCollection, { player1, player2: null })).pipe(
      switchMap((docRef) => docData(docRef, { idField: 'uid' }))
    ) as Observable<Room>;
  }
}
