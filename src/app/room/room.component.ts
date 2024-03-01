import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { FieldComponent } from './ui/field.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-room-component',
  template: `
    <div class="">
      <h1>Game Room</h1>
      <h2>It's '{{ roomService.room()?.currentPlayer }}' turn</h2>
      <h3>Winner is {{ winner }}</h3>
      <div class="w-64 h-64 grid grid-cols-3 gap-3">
        @if (!!roomService.room()) {
        <app-field
          [symbol]="this.roomService.gameBoard()[0]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(0)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[1]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(1)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[2]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(2)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[3]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(3)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[4]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(4)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[5]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(5)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[6]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(6)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[7]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(7)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[8]"
          [active]="this.roomService.isActivePlayer()"
          (selected)="roomService.selectField$.next(8)"
        />
        }
      </div>
    </div>
  `,
  imports: [FieldComponent],
})
export default class RoomComponent implements OnInit {
  @Input() id = '';

  roomService = inject(RoomService);

  winner: string | null = null;

  ngOnInit(): void {
    const item = localStorage.getItem(`room_${this.id}`);
    if (item) {
      this.roomService.joinRoom$.next({ id: this.id, player: item });
    } else {
      this.roomService.joinRoom$.next({ id: this.id, player: '2' });
    }
  }

  // checkBoard() {
  //   //check rows
  //   for (let i = 0; i < 9; i += 3) {
  //     if (
  //       this.gameBoard[i] === this.currentPlayer &&
  //       this.gameBoard[i + 1] === this.currentPlayer &&
  //       this.gameBoard[i + 2] === this.currentPlayer
  //     ) {
  //       return true;
  //     }
  //   }

  //   // Check columns
  //   for (let i = 0; i < 3; i++) {
  //     if (
  //       this.gameBoard[i] === this.currentPlayer &&
  //       this.gameBoard[i + 3] === this.currentPlayer &&
  //       this.gameBoard[i + 6] === this.currentPlayer
  //     ) {
  //       return true;
  //     }
  //   }

  //   // Check diagonals
  //   if (
  //     (this.gameBoard[0] === this.currentPlayer &&
  //       this.gameBoard[4] === this.currentPlayer &&
  //       this.gameBoard[8] === this.currentPlayer) ||
  //     (this.gameBoard[2] === this.currentPlayer &&
  //       this.gameBoard[4] === this.currentPlayer &&
  //       this.gameBoard[6] === this.currentPlayer)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
}
