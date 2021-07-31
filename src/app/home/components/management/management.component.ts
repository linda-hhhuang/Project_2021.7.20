import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { UserService } from '@core/service/user.service';
import { tap } from 'rxjs/operators';
import { ImportUser } from '@core/model/user';
import { User } from '@core/model/user';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit {
  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentSelectedUser!: User;

  isVisibleResetPassword = false;
  isOkLoadingResetPassword = false;
  resetPasswordValue: string = '';

  resetRoleValue: number = 0;
  isVisibleResetRole = false;
  isOkLoadingResetRole = false;

  importUserList: any;
  importUserHeader: any;
  importUserData: any;
  importUserJSONData: ImportUser[] = [];
  currentUserHeader = ['账户', '邮箱', '姓名', '身份', '操作'];
  role: any = {
    0: '超管',
    1: '教务',
    2: '教师',
    3: '学生',
  };
  currentUserList!: User[];
  importUserJSONHeader!: Array<string>;

  constructor(
    private userSrvc: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.userSrvc.userList$.subscribe((v) => (this.currentUserList = v));
    this.userSrvc.getUserList().subscribe();
  }

  showModalUpload(): void {
    this.isVisibleUpload = true;
  }

  handleOkUpload(): void {
    this.isOkLoadingUpload = true;
    console.log('in handleOkUpload, datai is ', this.importUserJSONData);
    this.userSrvc.importUser(this.importUserJSONData).subscribe((_) => {
      this.message.success('导入成功!');
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

  showModalResetPassword(e: any) {
    console.log('in resetpassword ', e);
    this.currentSelectedUser = e;
    this.isVisibleResetPassword = true;
  }

  handleOkResetPassword(): void {
    this.isOkLoadingResetPassword = true;
    this.userSrvc
      .resetPassword(this.resetPasswordValue, this.currentSelectedUser.uid)
      .subscribe((_) => {
        this.message.success(`成功修改用户密码为 ${this.resetPasswordValue}`);
        this.resetPasswordValue = '';
      });
    this.isOkLoadingResetPassword = false;
    this.isVisibleResetPassword = false;
  }

  handleCancelResetPassword(): void {
    this.isVisibleResetPassword = false;
    this.resetPasswordValue = '';
  }

  showModalResetRole(e: any) {
    console.log('in resetRole ', e);
    this.currentSelectedUser = e;
    this.isVisibleResetRole = true;
  }

  handleOkResetRole(): void {
    this.isOkLoadingResetRole = true;
    this.userSrvc
      .resetRole(this.resetRoleValue, this.currentSelectedUser.uid)
      .subscribe((_) => {
        this.message.success(
          `成功修改用户身份为 ${this.role[this.resetRoleValue]}`
        );
        this.resetRoleValue = 0;
      });
    this.isOkLoadingResetRole = false;
    this.isVisibleResetRole = false;
  }

  handleCancelResetRole(): void {
    this.isVisibleResetRole = false;
    this.resetRoleValue = 0;
  }

  beforeUpload = (file: any): boolean => {
    if (file) {
      const fileName = file.name; //获取文件名
      const reader: FileReader = new FileReader(); //FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件
      //当读取操作成功完成时调用FileReader.onload
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.importUserList = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log('importUserList', this.importUserList);
        //解析出文件数据，可以进行后面操作
        this.importUserHeader = ['账户', '邮箱', '姓名', '身份', '密码']; //获得表头字段
        this.importUserJSONHeader = [
          'sid',
          'email',
          'name',
          'role',
          'password',
        ];
        this.importUserData = this.importUserList.slice(1); //获得表头字段
        this.importUserJSONData = [];
        for (let i = 0; i < this.importUserData.length; i++) {
          let c: ImportUser = {
            sid: null,
            email: '',
            name: '',
            role: -1,
            password: '',
          };
          for (let j = 0; j < this.importUserJSONHeader.length; j++) {
            let temp =
              j == this.importUserJSONHeader.length - 1
                ? String(this.importUserData[i][j])
                : this.importUserData[i][j];
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

  deleteConfirm(user: User) {
    this.userSrvc.deleteUser(user.uid).subscribe((_) => {
      this.message.success('删除用户成功!');
    });
  }

  deleteCancel() {}
}
