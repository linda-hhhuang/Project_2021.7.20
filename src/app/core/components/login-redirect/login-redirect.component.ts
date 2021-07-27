import { Component, OnInit, OnDestroy } from '@angular/core';
import { Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, skip, skipWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '@core/service/user.service';
import { GlobalMessageService } from '@shared/ui-antd/global-message.service';
@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css'],
})
export class LoginRedirectComponent implements OnInit, OnDestroy {
  private ngOnDestroy$ = new Subject<void>();

  constructor(
    // @SkipSelf()
    // @Optional()
    private userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  ngOnInit() {
    console.log('in redirect');
    this.userServ.isLogin$
      .pipe(
        skipWhile((v) => v == -1),
        take(1),
        takeUntil(this.ngOnDestroy$)
      )
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          console.log('redirect home-true');
          this.router.navigate(['/home']);
        } else {
          console.log('redirect login-false');
          this.message.warning('登录超时,请重新登录');
          this.router.navigate(['/login']);
        }
      });
  }
  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}
