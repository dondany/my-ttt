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
      class="aspect-square bg-indigo-400 flex flex-col justify-center items-center cursor-pointer select-none"
      [ngClass]="{ 'hover:bg-indigo-200': active() }"
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
