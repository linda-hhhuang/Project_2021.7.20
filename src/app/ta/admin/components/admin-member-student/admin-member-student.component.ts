import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { MemberService } from '@ta/services/member.service';
import { ImportStudent, Student } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-member-student',
  templateUrl: './admin-member-student.component.html',
  styleUrls: ['./admin-member-student.component.css'],
})
export class AdminMemberStudentComponent implements OnInit {
  @Input() studentList: Student[] | null = [];
  currentDisplayUserList!: Student[] | null;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentSelectedUser!: Student;

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
  importUserJSONData: ImportStudent[] = [];
  importUserJSONHeader!: Array<string>;

  //表单
  resetname!: string | null;
  resettype!: string | null;
  resetmaxReq!: number | null;
  resetinfo!: string | null;

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.studentList$.subscribe((v) => {
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
      .importStudent(this.importUserJSONData)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpload = false;
        this.isVisibleUpload = false;
      });
    this.importUserList = this.importUserData = null;
  }
  handleCancelUpload(): void {
    console.log('Button cancel clicked!');
    this.importUserList = this.importUserData = null;
    this.isVisibleUpload = false;
  }

  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
    this.memberSrvc.getStudent(e.sid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.isVisibleShowInfo = true;
    });
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  showModalResetInfo(e: any) {
    console.log('in resetRole ', e);
    this.memberSrvc.getStudent(e.sid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.resetname = v.body.name;
      this.resettype = v.body.type;
      this.resetmaxReq = v.body.maxReq;
      this.resetinfo = v.body.info;
      this.isVisibleResetInfo = true;
    });
  }
  handleOkResetInfo(): void {
    this.isOkLoadingResetInfo = true;
    const resetInfoValue = {
      name: this.resetname,
      type: this.resettype,
      info: this.resetinfo,
      maxReq: this.resetmaxReq,
    };
    this.memberSrvc
      .UpdataStudent(resetInfoValue, this.currentSelectedUser.sid)
      .subscribe((_) => {
        this.message.success(`成功更新学生信息`);
        this.isOkLoadingResetInfo = false;
        this.isVisibleResetInfo = false;
      });
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
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => String(item.sid).indexOf(this.searchSidValue) !== -1
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

        this.importUserHeader = ['账户', '类型', '最大助教申请数量'];
        this.importUserJSONHeader = ['sid', 'type', 'maxReq'];
        this.importUserData = this.importUserList.slice(1); //获得表头字段
        this.importUserJSONData = [];
        for (let i = 0; i < this.importUserData.length; i++) {
          let c: ImportStudent = {
            sid: -1,
            type: '',
            maxReq: 0,
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

  deleteConfirm(user: Student) {
    this.memberSrvc.deleteMember(user.sid).subscribe((_) => {
      this.message.success('删除学生成功!');
    });
  }

  deleteCancel() {}
}
