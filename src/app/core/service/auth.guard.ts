import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, take } from 'rxjs/operators';
import { GlobalMessageService } from '@shared/ui-antd/global-message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userServ.isLogin$.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          console.log('guard', true);
          return true;
        } else {
          console.log('guard', false);
          this.message.warning('登录超时,请重新登录');
          return this.router.parseUrl('/login');
        }
      })
    );
  }
}
