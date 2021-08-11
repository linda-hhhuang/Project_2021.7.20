import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { UserService } from '@core/service/user.service';
@Component({
  selector: 'app-admin-member',
  templateUrl: './admin-member.component.html',
  styleUrls: ['./admin-member.component.css'],
})
export class AdminMemberComponent implements OnInit {
  studentList$ = this.memberSrvc.studentList$;
  teacherList$ = this.memberSrvc.teacherList$;

  constructor(private memberSrvc: MemberService) {}

  ngOnInit(): void {
    this.memberSrvc.memberlistInit();
    this.memberSrvc
      .getTime()
      .subscribe((_) => console.log('in member oginit', _));
  }
}
