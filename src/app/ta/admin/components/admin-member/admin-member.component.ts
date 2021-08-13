import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { TimeService } from '@ta/services/time.service';
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
    private timeSrvc: TimeService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.memberlistInit();
    this.timeSrvc
      .getTime()
      .subscribe((_) => console.log('in member oginit', _));
  }
}
