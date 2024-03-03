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
  winner: [];
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
  reset$ = new Subject<void>();

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
  currentPlayer = computed(() => this.state().room?.currentPlayer);
  gameBoard = computed(() => this.state().gameBoard);
  isActivePlayer = computed(() => {
    return this.state().player === this.state().room?.currentPlayer;
  });
  player = computed(() => this.state().player);
  winner = computed(() =>
    !!this.state().room!.winner ? this.state().room!.winner : [-1, -1, -1]
  );

  constructor() {
    connect(this.state)
      .with(
        this.create$.pipe(
          switchMap((player1) => this.createRoom(player1)),
          tap((room) => localStorage.setItem(`room_${room.uid}`, 'x')),
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
        this.reset$.pipe(
          switchMap(() => this.reset()),
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
        currentPlayer: 'x',
        player: 'x',
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
    board[field] = this.currentPlayer()!;
    const player = this.currentPlayer() === 'x' ? 'o' : 'x';
    const roomRef = doc(this.firestore, `rooms/${this.room()?.uid}`);
    return defer(() =>
      updateDoc(roomRef, {
        gameBoard: board,
        currentPlayer: player,
        winner: this.checkBoard(board),
      })
    );
  }

  private reset() {
    const roomRef = doc(this.firestore, `rooms/${this.room()?.uid}`);
    return defer(() =>
      updateDoc(roomRef, {
        gameBoard: [null, null, null, null, null, null, null, null, null],
        winner: [],
        currentPlayer: 'x',
      })
    );
  }

  private checkBoard(board: (string | null)[]) {
    console.log('checking..', board);
    //check rows
    for (let i = 0; i < 9; i += 3) {
      if (
        board[i] === this.currentPlayer() &&
        board[i + 1] === this.currentPlayer() &&
        board[i + 2] === this.currentPlayer()
      ) {
        return [i, i + 1, i + 2];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[i] === this.currentPlayer() &&
        board[i + 3] === this.currentPlayer() &&
        board[i + 6] === this.currentPlayer()
      ) {
        return [i, i + 3, i + 6];
      }
    }

    // Check diagonals
    if (
      board[0] === this.currentPlayer() &&
      board[4] === this.currentPlayer() &&
      board[8] === this.currentPlayer()
    ) {
      return [0, 4, 8];
    }

    if (
      board[2] === this.currentPlayer() &&
      board[4] === this.currentPlayer() &&
      board[6] === this.currentPlayer()
    ) {
      return [2, 4, 6];
    }
    return [];
  }
}
