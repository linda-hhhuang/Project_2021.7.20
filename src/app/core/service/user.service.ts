import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, timer } from 'rxjs';
import {
  debounceTime,
  map,
  skip,
  switchMap,
  take,
  tap,
  finalize,
} from 'rxjs/operators';
import { ApiService } from './api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const KEEP_LOGIN_INTERVAL = 60 * 60 * 1000; // 1 hour

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLogin = new BehaviorSubject<Boolean | null>(null);
  isLogin$ = this.isLogin.asObservable();
  private user = new BehaviorSubject<any | null>(null);
  user$ = this.user.asObservable();
  private isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(
    //没有下面这三行会导致rederict不成功 ... ?
    @SkipSelf()
    @Optional()
    userserv: UserService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    this.init().subscribe();

    // 定时保持登录状态;
    this.isLogin
      .pipe(
        switchMap((isLogin) =>
          isLogin ? timer(KEEP_LOGIN_INTERVAL, KEEP_LOGIN_INTERVAL) : of()
        )
      )
      .subscribe((_) => this.init().subscribe());
  }

  init() {
    return this.api.get<any>('/user/login').pipe(
      tap((response) => {
        this.isLogin.next(response.body !== null);
        console.log('in user service init', response);
      })
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
            this.isLogin.next(response.body !== null);
            this.user.next(response.body);
            console.log('in user service login ok', response);
          },
          error: (err) => {
            this.isLogin.next(false);
            this.handleError(err.error.msg);
            2;
            console.log('in user service login err', err);
          },
        }),
        finalize(() => this.isLoading.next(false))
      );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
  }
}
