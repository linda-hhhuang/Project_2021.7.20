import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Request, RequestList } from '@ta/model/lesson';
import { RequestService } from '@ta/admin/services/request.service';

@Component({
  selector: 'app-admin-operation',
  templateUrl: './admin-operation.component.html',
  styleUrls: ['./admin-operation.component.css'],
})
export class AdminOperationComponent implements OnInit {
  requestList: RequestList[] | null = [];
  currentDisplayRequestList!: RequestList[] | null;

  currentSelectedRequest!: Request;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchSidValue = '';
  visibleSearchSid = false;

  searchStatusValue = '';
  visibleSearchStatus = false;

  constructor(
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}

  init() {
    this.requestSrvc.getRequest().subscribe((v) => {
      this.currentDisplayRequestList = v.body;
      this.requestList = v.body;
      this.searchStatusValue = 'false';
      this.searchStatus();
    });
  }
  ngOnInit(): void {
    this.init();
  }

  showModalShowInfo(e: RequestList) {
    this.requestSrvc.getRequestInfo(e.rid).subscribe((v) => {
      this.currentSelectedRequest = v.body;
      this.isVisibleShowInfo = true;
    });
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayRequestList = this.requestList!.filter(
      (item: RequestList) =>
        String(item.sid).indexOf(this.searchSidValue) !== -1
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

  deleteConfirm(request: RequestList) {
    this.requestSrvc.deleRequest(request.rid).subscribe((_) => {
      this.message.success('不通过此申请执行成功!');
      this.init();
    });
  }

  passConfirm(request: RequestList) {
    this.requestSrvc.passRequest(request.rid).subscribe((_) => {
      this.message.success('通过此申请执行成功!');
      this.init();
    });
  }

  Cancel() {}
}
