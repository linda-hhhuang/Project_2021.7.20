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

  private member = new BehaviorSubject<any | null>(null);
  member$ = this.member.asObservable();
  private memberlist = new BehaviorSubject<any | null>(null);
  memberlist$ = this.memberlist.asObservable();
  private memberRole = new BehaviorSubject<number>(-1);
  memberRole$ = this.memberRole.asObservable();
  hasmember = -1;

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
        'You should not import UserService which is already imported in root!'
      );
    }
    this.init().subscribe();
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

  memberInit() {
    console.log('a member init');
    this.isLoading.next(true);

    if (this.user.value.role == 0 || this.user.value.role == 1) {
      return this.api.get<any>('/member/list').pipe(
        tap({
          next: (response) => {
            this.memberlist.next(response.body);
            console.log('in user member init 01', response);
          },
          error: (err) => {
            this.handleError('获取成员列表失败,请重试');
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    } else if (this.user.value.role == 2) {
      return this.api.get<any>('/member/teacher/me').pipe(
        tap({
          next: (response) => {
            this.member.next(response.body);
            console.log('in user member init 2', response);
            this.hasmember = response.body !== null ? 1 : 0;
          },
          error: (err) => {
            this.hasmember = 0;
            // this.handleError(err.error.msg);
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    } else if (this.user.value.role == 3) {
      return this.api.get<any>('/member/student/me').pipe(
        tap({
          next: (response) => {
            this.member.next(response.body);
            this.hasmember = response.body !== null ? 1 : 0;
            console.log('in user member init 3', response);
          },
          error: (err) => {
            this.hasmember = 0;
            // this.handleError(err.error.msg);
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    }

    console.log('member null error!!');
    return new Observable<any>();
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
