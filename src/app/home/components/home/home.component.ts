import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '@core/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isAdmin$ = this.userSrvc.user$.pipe(
    map((user) => user.role == 0 || user.role == 1)
  );

  constructor(private userSrvc: UserService) {}

  ngOnInit(): void {}
}
