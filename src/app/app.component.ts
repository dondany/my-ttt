import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <div class="h-screen bg-slate-900">
    <router-outlet />
  </div>`,
  styles: [],
})
export class AppComponent {}
