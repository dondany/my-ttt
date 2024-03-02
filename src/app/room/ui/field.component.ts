import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  input,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-field',
  template: `
    <div
      class="aspect-square bg-indigo-400 flex flex-col justify-center items-center 
      select-none rounded"
      [ngClass]="{
        'hover:bg-slate-200': active() && !symbol(),
        'bg-slate-200 cursor-pointer': !symbol(),
        'shadow-[5px_5px_0px_0px_#cac44d] bg-[#FBF46D]': symbol() === 'x',
        'shadow-[5px_5px_0px_0px_#5bc0b1] bg-[#77E4D4]': symbol() === 'o',
        'shadow-[5px_5px_0px_0px_#cbd5e1] bg-white': !symbol(),

      }"
      (click)="onClick()"
    >
      <span class="material-symbols-outlined text-4xl">
        @if (symbol() === 'x') { close } @else if (symbol() === 'o') { circle }
      </span>
    </div>
  `,
  imports: [CommonModule],
})
export class FieldComponent {
  symbol = input<string | null>(null);
  active = input<boolean>(false);
  @Output('selected') selectedEventEmitter = new EventEmitter();

  onClick() {
    if (!this.active() || !!this.symbol()) {
      return;
    }
    this.selectedEventEmitter.emit();
  }
}
