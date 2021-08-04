import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { MemberService } from '@ta/admin/services/member.service';
import { ImportTeacher, Teacher } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-member-teacher',
  templateUrl: './admin-member-teacher.component.html',
  styleUrls: ['./admin-member-teacher.component.css'],
})
export class AdminMemberTeacherComponent implements OnInit {
  @Input() teacherList: Teacher[] | null = [];
  currentDisplayUserList!: Teacher[] | null;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentSelectedUser!: Teacher;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  isVisibleResetInfo = false;
  isOkLoadingResetInfo = false;

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

  importUserList: any;
  importUserHeader: any;
  importUserData: any;
  importUserJSONData: ImportTeacher[] = [];
  importUserJSONHeader!: Array<string>;

  //表单
  resetname!: string;
  resetjob!: string;
  resetorganization!: string;
  resetinfo!: string;

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.teacherList$.subscribe((v) => {
      this.currentDisplayUserList = v;
    });
  }

  showModalUpload(): void {
    this.isVisibleUpload = true;
  }

  handleOkUpload(): void {
    this.isOkLoadingUpload = true;
    console.log('in handleOkUpload, data is ', this.importUserJSONData);
    this.memberSrvc
      .importTeacher(this.importUserJSONData)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpload = false;
      });
    this.importUserList = this.importUserData = null;
    this.isVisibleUpload = false;
  }

  handleCancelUpload(): void {
    console.log('Button cancel clicked!');
    this.importUserList = this.importUserData = null;
    this.isVisibleUpload = false;
  }

  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
    this.currentSelectedUser = e;
    this.isVisibleShowInfo = true;
  }

  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  showModalResetInfo(e: any) {
    console.log('in resetRole ', e);
    this.currentSelectedUser = e;
    this.resetname = e.name;
    this.resetorganization = e.organization;
    this.resetjob = e.job;
    this.resetinfo = e.info;
    this.isVisibleResetInfo = true;
  }

  handleOkResetInfo(): void {
    this.isOkLoadingResetInfo = true;
    const resetInfoValue = {
      name: this.resetname,
      job: this.resetjob,
      organization: this.resetorganization,
      info: this.resetinfo,
    };
    this.memberSrvc
      .UpdataTeacher(resetInfoValue, this.currentSelectedUser.sid)
      .subscribe((_) => {
        this.message.success(`成功更新教师信息`);
      });
    this.isOkLoadingResetInfo = false;
    this.isVisibleResetInfo = false;
  }

  handleCancelResetInfo(): void {
    this.isVisibleResetInfo = false;
  }

  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }

  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }

  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => String(item.sid).indexOf(this.searchSidValue) !== -1
    );
  }

  beforeUpload = (file: any): boolean => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.importUserList = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log('importUserList', this.importUserList);

        this.importUserHeader = ['账户', '职称', '组织'];
        this.importUserJSONHeader = ['sid', 'job', 'organization'];
        this.importUserData = this.importUserList.slice(1); //获得表头字段
        this.importUserJSONData = [];
        for (let i = 0; i < this.importUserData.length; i++) {
          let c: ImportTeacher = {
            sid: -1,
            job: '',
            organization: '',
          };
          for (let j = 0; j < this.importUserJSONHeader.length; j++) {
            let temp = this.importUserData[i][j];
            c[this.importUserJSONHeader[j]] = temp;
          }
          this.importUserJSONData.push(c);
        }
        console.log('importUserJSONData', this.importUserJSONData);
        console.log('importUserHeader', this.importUserHeader);
      };
      reader.readAsBinaryString(file);
    }
    return false;
  };

  deleteConfirm(user: Teacher) {
    this.memberSrvc.deleteMember(user.sid).subscribe((_) => {
      this.message.success('删除教师成功!');
    });
  }

  deleteCancel() {}
}
