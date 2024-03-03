import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  input,
} from '@angular/core';

// 'shadow-[5px_5px_0px_0px_#cac44d] bg-[#FBF46D]': symbol() === 'x',
//         'shadow-[5px_5px_0px_0px_#5bc0b1] bg-[#77E4D4]': symbol() === 'o',
//         'shadow-[5px_5px_0px_0px_#cbd5e1] bg-white': !symbol(),

@Component({
  standalone: true,
  selector: 'app-field',
  template: `
    <button
      class="aspect-square size-full flex flex-col justify-center items-center 
      select-none rounded-lg border-b-4 border-r-4"
      [ngClass]="{
        'hover:bg-slate-200 active:border-none': active() && !symbol(),
        'bg-slate-200 cursor-pointer': !symbol(),
         'bg-[#FBF46D] border-[#cac44d]': symbol() === 'x',
         'bg-[#77E4D4] border-[#5bc0b1]': symbol() === 'o',
         'bg-white border-[#cbd5e1]' : !symbol(),
         'bg-red-400 border-red-600 animate-pulse' : winner(),

      }"
      (click)="onClick()"
    >
      <span class="material-symbols-outlined text-4xl">
        @if (symbol() === 'x') { close } @else if (symbol() === 'o') { circle }
      </span>
    </button>
  `,
  imports: [CommonModule],
})
export class FieldComponent {
  symbol = input<string | null>(null);
  active = input<boolean>(false);
  winner = input<boolean>(false);
  @Output('selected') selectedEventEmitter = new EventEmitter();

  constructor() {
    effect(() => {
      console.log(this.winner());
    });
  }

  onClick() {
    if (!this.active() || !!this.symbol()) {
      return;
    }
    this.selectedEventEmitter.emit();
  }
}
