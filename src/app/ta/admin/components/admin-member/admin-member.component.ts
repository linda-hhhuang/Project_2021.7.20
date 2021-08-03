import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/admin/services/member.service';
import { UserService } from '@core/service/user.service';
@Component({
  selector: 'app-admin-member',
  templateUrl: './admin-member.component.html',
  styleUrls: ['./admin-member.component.css'],
})
export class AdminMemberComponent implements OnInit {
  studentList$ = this.memberSrvc.studentList$;
  teacherList$ = this.memberSrvc.teacherList$;

  constructor(
    private memberSrvc: MemberService,
    private userSrvc: UserService
  ) {}

  ngOnInit(): void {
    this.memberSrvc
      .getTime()
      .subscribe((_) => console.log('in member oginit', _));
  }
}
