import { Component, inject } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { FieldComponent } from './ui/field.component';

@Component({
  standalone: true,
  selector: 'app-room-component',
  template: `
    <div class="">
      <h1>Game Room</h1>
      <h2>It's '{{ currentPlayer }}' turn</h2>
      <div class="w-64 h-64 grid grid-cols-3 gap-3">
        <app-field [player]="gameBoard[0]" (click)="onClick(0)" />
        <app-field [player]="gameBoard[1]" (click)="onClick(1)" />
        <app-field [player]="gameBoard[2]" (click)="onClick(2)" />
        <app-field [player]="gameBoard[3]" (click)="onClick(3)" />
        <app-field [player]="gameBoard[4]" (click)="onClick(4)" />
        <app-field [player]="gameBoard[5]" (click)="onClick(5)" />
        <app-field [player]="gameBoard[6]" (click)="onClick(6)" />
        <app-field [player]="gameBoard[7]" (click)="onClick(7)" />
        <app-field [player]="gameBoard[8]" (click)="onClick(8)" />
      </div>
    </div>
  `,
  imports: [FieldComponent],
})
export default class RoomComponent {
  roomService = inject(RoomService);

  currentPlayer = 'x';

  gameBoard: (string | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  onClick(i: number) {
    if (!!this.gameBoard[i]) {
      return;
    }
    this.gameBoard[i] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
  }
}
