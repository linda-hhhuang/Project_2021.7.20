import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MemberService } from '@ta/services/member.service';
import { Student } from '@ta/model/member';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-student-personal',
  templateUrl: './student-personal.component.html',
  styleUrls: ['./student-personal.component.css'],
})
export class StudentPersonalComponent implements OnInit {
  isVisibleUpdateInfo = false;
  isOkLoadingUpdateInfo = false;

  currentStudentInfo!: Student;
  updateStudentInfo: Student = {
    sid: -1,
    name: '',
    type: '',
    info: '',
    maxReq: -1,
    sign: '',
  };

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  init() {
    this.memberSrvc.getStudentInfo().subscribe((student) => {
      this.currentStudentInfo = student.body;
      //console.log('in student-personal ngOnInit, data is ', student);
    });
  }
  ngOnInit(): void {
    this.init();
  }

  //修改个人信息
  showModalUpdateInfo(): void {
    this.memberSrvc.currentStudent$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        //console.log('in showModalUpdateInfo', v);
        this.isVisibleUpdateInfo = true;
        this.updateStudentInfo = v!;
      });
  }
  handleOkUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = true;
    //console.log('in handleOkUpdateInfo, data is ', this.updateStudentInfo);
    this.memberSrvc
      .updateStudentInfo(this.updateStudentInfo)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpdateInfo = false;
        this.isVisibleUpdateInfo = false;
      });
  }
  handleCancelUpdateInfo(): void {
    //console.log('Button cancel clicked!');
    this.isVisibleUpdateInfo = false;
  }

  beforeUpload = (file: any): boolean => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const bstr = reader.result!;
        //console.log('upload sign', file.size);
        const isLt2M = file.size / 1024 < 100;
        if (!isLt2M) {
          this.message.error('图片大小需小于100KB!');
        } else {
          this.updateStudentInfo.sign = String(bstr);
        }
      };
    }
    return false;
  };
}
