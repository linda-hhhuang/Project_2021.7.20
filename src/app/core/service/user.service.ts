import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLogin: Observable<boolean> = new ReplaySubject<boolean>(1);
  constructor() {
    (<ReplaySubject<boolean>>this.isLogin).next(false);
  }
}
