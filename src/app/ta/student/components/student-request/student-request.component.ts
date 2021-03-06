import { Component, OnInit } from '@angular/core';
import { OuterRequest } from '@ta/model/lesson';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '@ta/student/services/request.service';

@Component({
  selector: 'app-student-request',
  templateUrl: './student-request.component.html',
  styleUrls: ['./student-request.component.css'],
})
export class StudentRequestComponent implements OnInit {
  isVisibleOuter = false;
  isOkLoadingOuter = false;

  isVisibleOuterWarning = false;

  currentOuterRequest: OuterRequest = {
    deduction: false,
    deductTime: '',
    lessonTitle: '',
    lessonCode: '',
    lessonTerm: '',
    lessonClass: '',
    lessonScore: '',
    lessonStudentNum: '',
    lessonType: '',
    teacherName: '',
    teacherJob: '',
    teacherOrganization: '',
    studentComment: '',
  };

  constructor(
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {}

  //系统外课程
  showModalOuter(): void {
    this.showModalOuterWarning();
  }
  handleOkOuter(): void {
    this.isOkLoadingOuter = true;
    if (this.currentOuterRequest.studentComment.length > 100) {
      this.message.error('个人评价字数不能超过100个字!');
      this.isOkLoadingOuter = false;
      return;
    }
    this.requestSrvc
      .createRequestOuter(this.currentOuterRequest)
      .subscribe((_) => {
        this.isOkLoadingOuter = false;
        this.isVisibleOuter = false;
        this.message.success('成功发出助教申请!');
        this.currentOuterRequest = {
          deduction: false,
          deductTime: '',
          lessonTitle: '',
          lessonCode: '',
          lessonTerm: '',
          lessonClass: '',
          lessonScore: '',
          lessonStudentNum: '',
          lessonType: '',
          teacherName: '',
          teacherJob: '',
          teacherOrganization: '',
          studentComment: '',
        };
      });
  }
  handleCancelOuter(): void {
    this.isVisibleOuter = false;
  }

  //系统外提醒
  showModalOuterWarning(): void {
    this.isVisibleOuterWarning = true;
  }
  handleOkOuterWarning(): void {
    this.isVisibleOuterWarning = false;
    this.isVisibleOuter = true;
  }
  handleCancelOuterWarning(): void {
    this.isVisibleOuterWarning = false;
  }
}
