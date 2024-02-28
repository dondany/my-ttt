import { Component, effect, inject } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../app.config';
import { RoomService } from '../shared/room.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="div">
      <form
        [formGroup]="form"
        (ngSubmit)="roomService.create$.next(usernameControll!.getRawValue())"
        d
      >
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          formControlName="username"
          class="bg-gray-200"
        />
        <button type="submit" [disabled]="!form.valid">Start</button>
      </form>
    </div>
  `,
  imports: [ReactiveFormsModule],
})
export default class HomeComponent {
  roomService = inject(RoomService);

  form = inject(FormBuilder).group({
    username: ['', [Validators.required]],
  });

  get usernameControll() {
    return this.form.get('username');
  }

  constructor() {
    effect(() => {
      if (!!this.roomService.room()) {
        //route to room component
        console.log('routing too room...');
      }
    });
  }
}
