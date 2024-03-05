import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { FieldComponent } from './ui/field.component';

@Component({
  standalone: true,
  selector: 'app-room-component',
  template: `
    <div
      class="size-full flex flex-col items-center pt-12 gap-5 text-white font-mono"
    >
      @if (roomService.playerX() && roomService.playerO()) {
      <div class="flex justify-between items-center gap-3 text-black">
        <div class="flex border rounded">
          <span
            class="px-2 py-2 text-white text-center material-symbols-outlined"
            >close</span
          >
          <span class="w-44 bg-[#FBF46D] px-6 py-2">
            {{ roomService.playerX() }}</span
          >
          <span class="px-2 py-2 text-white text-center">{{
            roomService.playerXwins()
          }}</span>
        </div>
        <span class="text-white">VS</span>
        <div class="flex border rounded">
          <span class="px-2 py-2 text-white text-center">{{
            roomService.playerOwins()
          }}</span>
          <span class="w-44 bg-[#77E4D4] px-6 py-2 text-center">
            {{ roomService.playerO() }}</span
          >
          <span
            class="px-2 py-2 text-white text-center material-symbols-outlined"
            >circle</span
          >
        </div>
      </div>
      }
      <!-- <h3>Winner is {{ winner }}</h3> -->
      <div class="w-64 h-64 mt-8 grid grid-cols-3 gap-3">
        @if (!!roomService.room()) {
        <app-field
          [symbol]="this.roomService.gameBoard()[0]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(0)"
          (selected)="roomService.selectField$.next(0)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[1]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(1)"
          (selected)="roomService.selectField$.next(1)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[2]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(2)"
          (selected)="roomService.selectField$.next(2)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[3]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(3)"
          (selected)="roomService.selectField$.next(3)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[4]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(4)"
          (selected)="roomService.selectField$.next(4)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[5]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(5)"
          (selected)="roomService.selectField$.next(5)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[6]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(6)"
          (selected)="roomService.selectField$.next(6)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[7]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(7)"
          (selected)="roomService.selectField$.next(7)"
        />
        <app-field
          [symbol]="this.roomService.gameBoard()[8]"
          [active]="this.roomService.isActivePlayer()"
          [winner]="this.roomService.winnerFields().includes(8)"
          (selected)="roomService.selectField$.next(8)"
        />
        }
      </div>

      @if (!roomService.playerO()) {
      <p>
        <span>Waiting for other player to join...</span>
      </p>
      } @else if (!roomService.winner()) {
      <p>
        <span>
          @if (roomService.currentPlayer() === roomService.player()) {
          <span>It's your turn!</span>
          } @else {
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined animate-spin"
              >progress_activity</span
            >
            <span>Waiting for the other player's move...</span>
          </div>
          }
        </span>
      </p>
      } @else {
      <p class="flex flex-col gap-3">
        @if (roomService.winner() == 'tie') {
        <span class="text-4xl">It's a tie!</span>
        } @else {
        <span class="text-4xl"
          >{{
            roomService.winner() === 'x'
              ? roomService.playerX()
              : roomService.playerO()
          }}
          is the winner!</span
        >
        }

        <button
          (click)="this.roomService.reset$.next()"
          class="px-4 py-2 m-auto rounded-lg text-black bg-white hover:bg-slate-200 cursor-pointer border-b-4 border-r-4 border-[#cbd5e1]"
        >
          Next Game
        </button>
      </p>
      }
    </div>
  `,
  imports: [FieldComponent, CommonModule],
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
      this.roomService.joinRoom$.next({ id: this.id, player: 'o' });
    }
  }
}
