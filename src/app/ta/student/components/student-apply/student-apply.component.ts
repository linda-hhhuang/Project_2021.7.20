import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Lesson, Request, RequestList } from '@ta/model/lesson';
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
  requestList: RequestList[] = [];
  currentDisplayRequestList: RequestList[] = [];

  alreadyRequest = 0;
  restRequest = 0;

  currentStudentInfo: Student = {
    sid: -1,
    name: '',
    type: '',
    info: '',
    maxReq: 0,
  };

  currentSelectedRequest!: Request;

  isVisiblePostAgreement = false;
  isOkLoadingPostAgreement = false;

  isVisibleShowAgreement = false;
  isOkLoadingShowAgreement = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchStatusValue = '';
  visibleSearchStatus = false;

  constructor(
    private memberSrvc: MemberService,
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}
  init() {
    this.requestSrvc.requestList$.subscribe((v) => {
      this.requestList = v!;
      this.currentDisplayRequestList = this.requestList;
    });
    this.memberSrvc.currentStudent$.subscribe((student) => {
      this.currentStudentInfo = student!;
    });
  }

  ngOnInit(): void {
    this.memberSrvc.getStudentInfo().subscribe((student) => {
      this.currentStudentInfo = student.body;
      console.log('in student-personal ngOnInit, data is ', student);
      this.restRequest = this.currentStudentInfo.maxReq! - this.alreadyRequest;
    });
    this.requestSrvc.getRequest().subscribe((v: any) => {
      this.requestList = v.body;
      this.currentDisplayRequestList = this.requestList;
      this.alreadyRequest = this.requestList.filter((v) => !v.isDeleted).length;
      if (this.currentStudentInfo.maxReq != null) {
        this.restRequest =
          this.currentStudentInfo.maxReq! - this.alreadyRequest;
      }
    });
  }

  //按课程名搜索
  resetTitle(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }
  searchTitle(): void {
    this.visibleSearchTitle = false;
    this.currentDisplayRequestList = this.requestList!.filter(
      (item: RequestList) =>
        item.lessonTitle!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按状态搜索
  resetStatus(): void {
    this.searchStatusValue = '';
    this.searchStatus();
  }
  searchStatus(): void {
    this.visibleSearchStatus = false;
    this.currentDisplayRequestList = this.requestList!.filter(
      (item: RequestList) =>
        String(item.isDeleted!).indexOf(this.searchStatusValue) !== -1
    );
  }

  //修改助教工作协议
  showModalPostAgreement(rid: number) {
    console.log('in PostAgreement ', rid);
    this.requestSrvc.getRequestInfo(rid).subscribe((v) => {
      this.currentSelectedRequest = v.body;
      this.isVisiblePostAgreement = true;
    });
  }
  handleOkPostAgreement(): void {
    this.isOkLoadingPostAgreement = true;
    console.log(
      'in student-apply handleOkPostAgreement',
      this.currentSelectedRequest
    );
    if (this.currentSelectedRequest.studentComment.length > 100) {
      this.message.error('个人评价字数不能超过100个字!');
      this.isOkLoadingPostAgreement = false;

      return;
    }
    this.requestSrvc
      .updateRequest(this.currentSelectedRequest)
      .subscribe(() => {
        this.isVisiblePostAgreement = false;
        this.message.success('提交助教工作协议成功!');
        this.isOkLoadingPostAgreement = false;
      });
  }
  handleCancelPostAgreement(): void {
    this.isVisiblePostAgreement = false;
  }

  //查看助教工作协议
  showModalShowAgreement(rid: number) {
    console.log('in ShowAgreement ', rid);
    this.requestSrvc.getRequestInfo(rid).subscribe((v) => {
      this.currentSelectedRequest = v.body;
      this.isVisibleShowAgreement = true;
    });
  }
  handleOkShowAgreement(): void {
    this.isVisibleShowAgreement = false;
  }

  CancelRequestConfirm(rid: number) {
    this.requestSrvc.deleteRequest(rid).subscribe(() => {
      this.message.success('删除对此课程的助教申请成功!');
      this.init();
    });
  }

  Cancel() {}
}
