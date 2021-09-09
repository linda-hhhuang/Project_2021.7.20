import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { Teacher } from '@ta/model/member';

@Component({
  selector: 'app-student-all-teacher',
  templateUrl: './student-all-teacher.component.html',
  styleUrls: ['./student-all-teacher.component.css'],
})
export class StudentAllTeacherComponent implements OnInit {
  teacherList: Teacher[] | null = [];
  currentDisplayTeacherList!: Teacher[] | null;

  currentSelectedTeacher!: Teacher;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchCodeValue = '';
  visibleSearchCode = false;

  constructor(private memberSrvc: MemberService) {}

  ngOnInit(): void {
    this.memberSrvc.getTeacherInfoList().subscribe();
    this.memberSrvc.teacherInfoList$.subscribe((v) => {
      this.currentDisplayTeacherList = v;
      this.teacherList = v;
    });
  }

  //查看老师详细信息
  showModalShowInfo(e: any) {
    //console.log('in ShowInfo ', e);
    this.memberSrvc.getTeacher(e.sid).subscribe((v) => {
      this.currentSelectedTeacher = v.body;
      this.isVisibleShowInfo = true;
    });
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  //按课程名搜索
  resetTitle(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }
  searchTitle(): void {
    this.visibleSearchTitle = false;
    this.currentDisplayTeacherList = this.teacherList!.filter(
      (item: Teacher) => item.name!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按课程lid搜索
  resetCode(): void {
    this.searchCodeValue = '';
    this.searchCode();
  }
  searchCode(): void {
    this.visibleSearchCode = false;
    this.currentDisplayTeacherList = this.teacherList!.filter(
      (item: Teacher) => String(item.sid).indexOf(this.searchCodeValue) !== -1
    );
  }
}
