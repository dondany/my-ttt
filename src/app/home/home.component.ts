import { Component, effect, inject } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../app.config';
import { RoomService } from '../shared/room.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="div">
      <form
        [formGroup]="form"
        (ngSubmit)="roomService.create$.next(usernameControl!.getRawValue())"
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
  router = inject(Router);

  form = inject(FormBuilder).group({
    username: ['', [Validators.required]],
  });

  get usernameControl() {
    return this.form.get('username');
  }

  constructor() {
    effect(() => {
      if (!!this.roomService.room()) {
        this.router.navigate(['room', this.roomService.room()?.uid]);
      }
    });
  }
}
