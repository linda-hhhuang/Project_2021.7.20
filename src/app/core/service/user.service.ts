import { Injectable, Optional, SkipSelf } from '@angular/core';
import {
  BehaviorSubject,
  observable,
  Observable,
  of,
  ReplaySubject,
  timer,
} from 'rxjs';
import {
  debounceTime,
  map,
  skip,
  switchMap,
  take,
  tap,
  distinctUntilChanged,
  finalize,
} from 'rxjs/operators';
import { ApiService } from './api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const KEEP_LOGIN_INTERVAL = 60 * 60 * 1000; // 1 hour

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<any | null>(null);
  user$ = this.user.asObservable();
  private isLogin = new BehaviorSubject<number>(-1);
  isLogin$ = this.isLogin.asObservable();
  private isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();
  constructor(
    // 没有下面这三行会导致rederict不成功 ... ?
    @SkipSelf()
    @Optional()
    userserv: UserService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (userserv) {
      throw new Error(
        'You should not import SharedDomainDataApiModule which is already imported in AppModule!'
      );
    }
    this.init().subscribe();
    this.isLogin$.subscribe((a) => console.log(a));
  }

  init() {
    console.log('a init');
    this.isLoading.next(true);
    return this.api.get<any>('/user/login').pipe(
      tap({
        next: (response) => {
          this.user.next(response.body);
          this.isLogin.next(Number(response.body != null));
          console.log('in user service init', response.body != null);
          console.log('in user service init', response);
        },
        error: (err) => {
          this.user.next(null);
          this.isLogin.next(0);
        },
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  login(username: number, password: string) {
    this.isLoading.next(true);
    return this.api
      .post<any>('/user/login/sid', {
        sid: username,
        password: password,
      })
      .pipe(
        tap({
          next: (response) => {
            this.user.next(response.body);
            this.isLogin.next(Number(response.body != null));
            console.log('in user service login ok', response);
          },
          error: (err) => {
            this.user.next(null);
            this.isLogin.next(0);
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => this.isLoading.next(false))
      );
  }

  logout() {
    this.isLoading.next(true);
    return this.api.get<any>('/user/logout').pipe(
      tap((response) => {
        this.user.next(null);
        this.isLogin.next(0);
        console.log('in user service logout', response);
      }),
      finalize(() => this.isLoading.next(false))
    );
  }
  private handleError(error: string) {
    this.notify.error('错误', error);
  }
}
