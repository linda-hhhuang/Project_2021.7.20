import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
    private userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  ngOnInit() {
    this.userServ.isLogin$
      .pipe(take(1), takeUntil(this.ngOnDestroy$))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/home']);
        } else {
          this.message.warning('登录超时,请重新登录');
          // 需要做个全局的
          this.router.navigate(['/login']);
        }
      });
  }
  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}
