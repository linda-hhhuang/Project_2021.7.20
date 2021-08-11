import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Lesson, StudentRequest } from '@ta/model/lesson';
import { StudentAgreement } from '@ta/model/request';
import { Student, Teacher } from '@ta/model/member';
import { MemberService } from '@ta/services/member.service';
import { RequestService } from '@ta/student/services/request.service';

@Component({
  selector: 'app-student-apply',
  templateUrl: './student-apply.component.html',
  styleUrls: ['./student-apply.component.css'],
})
export class StudentApplyComponent implements OnInit {
  //request还是studentrequest？
  requestList: StudentRequest[] | null = [];
  currentDisplayRequestList: StudentRequest[] | null = [];
  currentStudentInfo!: Student;

  currentSelectedRequest!: StudentRequest;

  isVisibleShowAgreement = false;
  isOkLoadingShowAgreement = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchCodeValue = '';
  visibleSearchCode = false;

  constructor(
    private memberSrvc: MemberService,
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}

  init() {
    this.memberSrvc.getStudentInfo().subscribe((student) => {
      this.currentStudentInfo = student.body;
      console.log('in student-personal ngOnInit, data is ', student);
    });
    this.requestSrvc.getRequest().subscribe((v) => {
      this.requestList = v.body;
      this.currentDisplayRequestList = this.requestList;
    });
  }

  ngOnInit(): void {
    this.init();
  }

  //按课程名搜索
  resetTitle(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }
  searchTitle(): void {
    this.visibleSearchTitle = false;
    this.currentDisplayRequestList = this.requestList!.filter(
      (item: StudentRequest) =>
        item.Lesson.title!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按课程代码搜索
  resetCode(): void {
    this.searchCodeValue = '';
    this.searchCode();
  }

  searchCode(): void {
    this.visibleSearchCode = false;
    this.currentDisplayRequestList = this.requestList!.filter(
      (item: StudentRequest) =>
        String(item.Lesson.code).indexOf(this.searchCodeValue) !== -1
    );
  }

  //助教工作协议
  showModalShowAgreement(e: StudentRequest) {
    console.log('in ShowAgreement ', e);
    this.currentSelectedRequest = e;
    this.isVisibleShowAgreement = true;
  }
  handleOkShowAgreement(): void {
    if (this.currentSelectedRequest.studentComment.length > 100) {
      this.message.error('个人评价字数不能超过100个字!');
      return;
    }
    this.isVisibleShowAgreement = false;
    this.requestSrvc
      .uploadAgrement(this.currentSelectedRequest)
      .subscribe(() => {
        this.message.success('提交助教工作协议成功!');
      });
  }
  handleCancelShowAgreement(): void {
    this.isVisibleShowAgreement = false;
  }

  CancelRequestConfirm(lesson: Lesson) {
    this.requestSrvc
      .deleteRequest(
        this.requestList?.filter((v) => v.lessonLid == lesson.lid)[0].rid!
      )
      .subscribe(() => {
        this.message.success('删除对此课程的助教申请成功!');
        this.init();
      });
  }

  Cancel() {}

  filiterTeacherName(l: Teacher[]) {
    return l.map((o) => o.name + '（' + o.sid + '）').join('，');
  }
}
