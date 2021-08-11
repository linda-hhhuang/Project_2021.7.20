import { Component, OnInit } from '@angular/core';
import { LessonService } from '@ta/services/lesson.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Lesson, StudentRequest } from '@ta/model/lesson';
import { Teacher } from '@ta/model/member';
import { StudentAgreement } from '@ta/model/request';
import { RequestService } from '@ta/student/services/request.service';
@Component({
  selector: 'app-student-all-lesson',
  templateUrl: './student-all-lesson.component.html',
  styleUrls: ['./student-all-lesson.component.css'],
})
export class StudentAllLessonComponent implements OnInit {
  requestList: StudentRequest[] | null = [];
  requestlseeonIDList: number[] = [];

  lessonList: Lesson[] | null = [];
  currentDisplayLessonList!: Lesson[] | null;

  currentSelectedLesson!: Lesson;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchCodeValue = '';
  visibleSearchCode = false;
  constructor(
    private lessonSrvc: LessonService,
    private requestSrvc: RequestService,
    private message: NzMessageService
  ) {}

  init() {
    this.lessonSrvc.lessonList$.subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
    this.requestSrvc.getRequest().subscribe((v) => {
      this.requestList = v.body;
      this.requestlseeonIDList = this.requestList!.map(
        (list) => list.lessonLid
      );
    });
  }
  ngOnInit(): void {
    this.init();
  }

  //查看课程详情
  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
    this.currentSelectedLesson = e;
    this.lessonSrvc.getLessonInfo(e.lid).subscribe((v) => {
      console.log('in lesson showModalShowInfo', v);
      this.currentSelectedLesson.Requests = v.body.Requests;
    });
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

  //按课程代码搜索
  resetCode(): void {
    this.searchCodeValue = '';
    this.searchCode();
  }
  searchCode(): void {
    this.visibleSearchCode = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) => String(item.code).indexOf(this.searchCodeValue) !== -1
    );
  }

  RequestConfirm(lesson: Lesson) {
    this.requestSrvc.postRequest(lesson.lid).subscribe(() => {
      this.message.success('申请此课程助教成功!');
      this.init();
    });
  }

  CancelRequestConfirm(lesson: Lesson) {
    this.requestSrvc
      .deleteRequest(
        this.requestList?.filter((v) => v.lessonLid == lesson.lid)[0].rid!
      )
      .subscribe(() => {
        this.message.success('删除对此课程的助教申请成功!');
        this.init();
      });
  }

  Cancel() {}

  filiterTeacherName(l: Teacher[]) {
    return l.map((o) => o.name + '（' + o.sid + '）').join('，');
  }
}
