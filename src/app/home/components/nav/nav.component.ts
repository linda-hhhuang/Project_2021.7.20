import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: any;
  role: any = {
    0: '超管',
    1: '教务',
    2: '老师',
    3: '学生',
  };
  constructor(
    private message: NzMessageService,
    private userServ: UserService,
    private readonly router: Router
  ) {
    this.userServ.user$.subscribe((v) => (this.user = v));
  }
  logout() {
    this.userServ.logout().subscribe(() => {
      this.message.success(`成功登出！`);
      this.router.navigateByUrl('/login');
    });
  }
  ngOnInit(): void {}
}
