import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { FIRESTORE } from '../app.config';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import {
  Observable,
  Subject,
  catchError,
  defer,
  exhaustMap,
  from,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { connect } from 'ngxtension/connect';
import { docData } from 'rxfire/firestore';

export interface JoinRoomModel {
  id: string;
  player: string;
}

export interface Room {
  uid: string;
  player1: string | null;
  player2: string | null;
  gameBoard: (string | null)[];
  currentPlayer: string | null;
}

export interface RoomState {
  room: Room | null;
  gameBoard: (string | null)[];
  player: string | null;
  error: string | null;
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  firestore = inject(FIRESTORE);

  //sources
  joinRoom$ = new Subject<JoinRoomModel>();
  create$ = new Subject<string>();
  selectField$ = new Subject<number>();

  //state
  private state = signal<RoomState>({
    room: null,
    gameBoard: [null, null, null, null, null, null, null, null, null],
    player: null,
    error: null,
    loaded: false,
  });

  //selectors
  room = computed(() => this.state().room);
  currentPlayer = computed(() => this.state().room!.currentPlayer);
  gameBoard = computed(() => this.state().gameBoard);
  isActivePlayer = computed(() => {
    console.log(this.state().player === this.state().room?.currentPlayer);
    return this.state().player === this.state().room?.currentPlayer;
  });
  player = computed(() => this.state().player);

  constructor() {
    connect(this.state)
      .with(
        this.create$.pipe(
          switchMap((player1) => this.createRoom(player1)),
          tap((room) => localStorage.setItem(`room_${room.uid}`, '1')),
          map((room) => ({ room, gameBoard: room.gameBoard }))
        )
      )
      .with(
        this.selectField$.pipe(
          switchMap((i) => this.selectField(i)),
          ignoreElements(),
          catchError((error) => of(error))
        )
      )
      .with(
        this.joinRoom$.pipe(
          exhaustMap((joinRoom) => this.joinRoom(joinRoom)),
          map((room) => ({ room, gameBoard: room.gameBoard }))
        )
      );
  }

  private createRoom(player1: string) {
    const roomCollection = collection(this.firestore, 'rooms');
    return from(
      addDoc(roomCollection, {
        player1,
        player2: null,
        gameBoard: [null, null, null, null, null, null, null, null, null],
        currentPlayer: '1',
        player: 1,
      })
    ).pipe(
      switchMap((docRef) => docData(docRef, { idField: 'uid' }))
    ) as Observable<Room>;
  }

  private joinRoom(joinRoom: JoinRoomModel) {
    localStorage.setItem(`room_${joinRoom.id}`, joinRoom.player);
    this.state().player = joinRoom.player;
    const roomRef = doc(this.firestore, `rooms/${joinRoom.id}`);
    return docData(roomRef, { idField: 'uid' }) as Observable<Room>;
  }

  private selectField(field: number) {
    const board = [...this.state().room!.gameBoard];
    board[field] = this.currentPlayer() === '1' ? 'x' : 'o';
    const player = this.currentPlayer() === '1' ? '2' : '1';
    const roomRef = doc(this.firestore, `rooms/${this.room()?.uid}`);
    return defer(() =>
      updateDoc(roomRef, { gameBoard: board, currentPlayer: player })
    );
  }
}
