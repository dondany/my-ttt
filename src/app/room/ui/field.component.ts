import { Component, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-field',
  template: `
    <div
      class="aspect-square bg-indigo-400 hover:bg-indigo-200 flex flex-col justify-center items-center cursor-pointer"
    >
      <span class="material-symbols-outlined text-4xl">
        @if (player === 'x') { close } @else if (player === 'o') { circle }
      </span>
    </div>
  `,
})
export class FieldComponent {
  @Input() player: string | null = null;
}
