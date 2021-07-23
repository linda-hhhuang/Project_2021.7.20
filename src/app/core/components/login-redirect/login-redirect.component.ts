import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@core/service/user.service';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css'],
})
export class LoginRedirectComponent implements OnInit, OnDestroy {
  private ngOnDestroy$ = new Subject<void>();
  constructor(private userServ: UserService, private router: Router) {}
  ngOnInit() {
    // this.userServ.isLogin
    //   .pipe(take(1), takeUntil(this.ngOnDestroy$))
    //   .subscribe((isLoggedIn) =>
    //     this.router.navigate([isLoggedIn ? '/home' : '/login'])
    //   );
    this.router.navigate([this.userServ.isLogin ? '/home' : '/login']);
  }
  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}
