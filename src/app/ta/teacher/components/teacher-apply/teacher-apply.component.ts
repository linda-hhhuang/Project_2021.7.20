import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Request, RequestList } from '@ta/model/lesson';

import { Teacher } from '@ta/model/member';
import { MemberService } from '@ta/services/member.service';
import { RequestService } from '@ta/teacher/services/request.service';

@Component({
  selector: 'app-teacher-apply',
  templateUrl: './teacher-apply.component.html',
  styleUrls: ['./teacher-apply.component.css'],
})
export class TeacherApplyComponent implements OnInit {
  requestList: RequestList[] = [];
  currentDisplayRequestList: RequestList[] = [];

  currentTeacherInfo: Teacher = {
    sid: -1,
    name: '',
    info: '',
    job: '',
    organization: '',
  };

  currentSelectedRequest!: Request;

  isVisiblePostAgreement = false;
  isOkLoadingPostAgreement = false;

  isVisibleRequestInfo = false;
  isOkLoadingRequestInfo = false;

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
    this.memberSrvc.getTeacherInfo().subscribe((teacher) => {
      this.currentTeacherInfo = teacher.body;
    });
    this.requestSrvc.getRequest().subscribe((v: any) => {
      this.requestList = v.body;
      this.currentDisplayRequestList = this.requestList;
      this.searchStatusValue = 'false';
      this.searchStatus();
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
    this.requestSrvc.getRequestInfo(rid).subscribe((v) => {
      this.currentSelectedRequest = v.body;
      this.isVisiblePostAgreement = true;
    });
  }
  handleOkPostAgreement(): void {
    this.isOkLoadingPostAgreement = true;
    if (this.currentSelectedRequest.teacherComment.length > 100) {
      this.message.error('教师评价字数不能超过100个字!');
      this.isOkLoadingPostAgreement = false;
      return;
    }
    this.requestSrvc
      .uploadAgrement(this.currentSelectedRequest)
      .subscribe(() => {
        this.isVisiblePostAgreement = false;
        this.message.success('提交教师评语成功!');
        this.isOkLoadingPostAgreement = false;
      });
  }
  handleCancelPostAgreement(): void {
    this.isVisiblePostAgreement = false;
  }

  //查看申请信息
  showModalRequestInfo(rid: number) {
    this.requestSrvc.getRequestInfo(rid).subscribe((v) => {
      this.currentSelectedRequest = v.body;
      this.isVisibleRequestInfo = true;
    });
  }
  handleOkRequestInfo(): void {
    this.isVisibleRequestInfo = false;
  }

  //删除对此课程的助教
  CancelRequestConfirm(rid: number) {
    this.requestSrvc.deleteRequest(rid).subscribe(() => {
      this.message.success('删除对此课程的助教申请成功!');
      this.init();
    });
  }

  passRequestConfirm(rid: number) {
    this.requestSrvc.passRequest(rid).subscribe((_) => {
      this.message.success('通过此申请执行成功!');
      this.init();
    });
  }

  signRequestConfirm(rid: number) {
    this.requestSrvc.signAgrement(rid).subscribe((_) => {
      this.message.success('签名确认此申请成功!');
      this.init();
    });
  }

  Cancel() {}
}
