import { Component, OnInit } from '@angular/core';
import { LessonService } from '@ta/services/lesson.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InnerRequest, Lesson } from '@ta/model/lesson';
import { RequestService } from '@ta/student/services/request.service';
@Component({
  selector: 'app-student-all-lesson',
  templateUrl: './student-all-lesson.component.html',
  styleUrls: ['./student-all-lesson.component.css'],
})
export class StudentAllLessonComponent implements OnInit {
  lessonList: Lesson[] | null = [];
  currentDisplayLessonList!: Lesson[] | null;

  currentSelectedLesson!: Lesson;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchTeacherValue = '';
  visibleSearchTeacher = false;

  isVisibleInner = false;
  isOkLoadingInner = false;

  currentInnerRequest: InnerRequest = {
    deduction: false,
    deductTime: '',
    lessonLid: null,
    studentComment: '',
  };

  constructor(
    private lessonSrvc: LessonService,
    private message: NzMessageService,
    private requestSrvc: RequestService
  ) {}

  ngOnInit(): void {
    this.lessonSrvc.lessonList$.subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
  }

  //查看课程所有请求
  showModalShowInfo(e: any) {
    //console.log('in ShowInfo ', e);
    this.currentSelectedLesson = e;
    this.isVisibleShowInfo = true;
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  //按课程名搜索
  resetTitle(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }
  searchTitle(): void {
    this.visibleSearchTitle = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) => item.title!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按课程lid搜索
  resetTeacher(): void {
    this.searchTeacherValue = '';
    this.searchTeacher();
  }
  searchTeacher(): void {
    this.visibleSearchTeacher = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) =>
        String(item.teachers).indexOf(this.searchTeacherValue) !== -1
    );
  }
  Cancel() {}

  //系统内课程
  showModalInner(e: Lesson): void {
    this.isVisibleInner = true;
    this.currentInnerRequest.lessonLid = e.lid;
  }
  handleOkInner(): void {
    this.isOkLoadingInner = true;
    if (this.currentInnerRequest.studentComment.length > 100) {
      this.message.error('个人评价字数不能超过100个字!');
      this.isOkLoadingInner = false;
      return;
    }
    this.requestSrvc
      .createRequestInner(this.currentInnerRequest)
      .subscribe((v) => {
        this.isOkLoadingInner = false;
        this.isVisibleInner = false;
        this.message.success('成功发出助教申请!');
        this.currentInnerRequest = {
          deduction: false,
          deductTime: '',
          lessonLid: null,
          studentComment: '',
        };
      });
  }
  handleCancelInner(): void {
    this.isVisibleInner = false;
  }
}
