import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MemberService } from '@ta/services/member.service';
import { Teacher } from '@ta/model/member';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-teacher-personal',
  templateUrl: './teacher-personal.component.html',
  styleUrls: ['./teacher-personal.component.css'],
})
export class TeacherPersonalComponent implements OnInit {
  isVisibleUpdateInfo = false;
  isOkLoadingUpdateInfo = false;

  currentTeacherInfo!: Teacher;
  updateTeacherInfo: Teacher = {
    sid: -1,
    name: '',
    job: '',
    organization: '',
    info: '',
    sign: '',
  };
  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  init() {
    this.memberSrvc.getTeacherInfo().subscribe((student) => {
      this.currentTeacherInfo = student.body;
      //console.log('in student-personal ngOnInit, data is ', student);
    });
  }
  ngOnInit(): void {
    this.init();
  }

  //修改个人信息
  showModalUpdateInfo(): void {
    this.memberSrvc.currentTeacher$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        //console.log('in showModalUpdateInfo', v);
        this.isVisibleUpdateInfo = true;
        this.updateTeacherInfo = v!;
      });
  }
  handleOkUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = true;
    //console.log('in handleOkUpdateInfo, data is ', this.updateTeacherInfo);
    this.memberSrvc
      .updateTeacherInfo(this.updateTeacherInfo)
      .subscribe((response) => {
        this.isOkLoadingUpdateInfo = false;
        this.message.success(response.msg);
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
          this.updateTeacherInfo.sign = String(bstr);
        }
      };
    }
    return false;
  };
}
