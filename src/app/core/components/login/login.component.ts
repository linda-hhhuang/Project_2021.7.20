import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  isLogging = false;

  constructor(
    private notify: NzNotificationService,
    private message: NzMessageService,
    private userServ: UserService,
    private readonly router: Router
  ) {
    this.userServ.isLoading$.subscribe((value) => (this.isLogging = value));
  }

  login() {
    this.userServ
      .login(Number(this.username.value), this.password.value)
      .subscribe((response) => {
        console.log('in component response is ', response);
        if (response.body !== null) {
          this.message.success(`欢迎！`);
          this.router.navigateByUrl('/home');
        } else {
          this.notify.warning(response.msg, '');
        }
      });
  }
  ngOnInit(): void {}
}
