import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Request } from '@ta/model/lesson';
import { RequestService } from '@ta/admin/services/request.service';

@Component({
  selector: 'app-admin-operation',
  templateUrl: './admin-operation.component.html',
  styleUrls: ['./admin-operation.component.css'],
})
export class AdminOperationComponent implements OnInit {
  requestList: Request[] | null = [];
  currentDisplayRequestList!: Request[] | null;

  currentSelectedRequest!: Request;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchSidValue = '';
  visibleSearchSid = false;
  constructor(
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.requestSrvc.requestList$.subscribe((v) => {
      this.currentDisplayRequestList = v;
      this.requestList = v;
    });
  }

  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
    this.currentSelectedRequest = e;
    this.isVisibleShowInfo = true;
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
      (item: Request) => String(item.sid).indexOf(this.searchSidValue) !== -1
    );
  }

  deleteConfirm(request: Request) {
    this.requestSrvc.deleRequest(request.rid).subscribe((_) => {
      this.message.success('不通过此申请执行成功!');
    });
  }

  passConfirm(request: Request) {
    this.requestSrvc.passRequest(request.rid).subscribe((_) => {
      this.message.success('通过此申请执行成功!');
    });
  }

  Cancel() {}
}
