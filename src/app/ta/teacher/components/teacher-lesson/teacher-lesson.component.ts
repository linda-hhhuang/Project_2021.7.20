import { Component, OnInit } from '@angular/core';
import { TeacherOwnLesson } from '@ta/model/lesson';
import { MemberService } from '@ta/services/member.service';
import { LessonService } from '@ta/services/lesson.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '@ta/teacher/services/request.service';
@Component({
  selector: 'app-teacher-lesson',
  templateUrl: './teacher-lesson.component.html',
  styleUrls: ['./teacher-lesson.component.css'],
})
export class TeacherLessonComponent implements OnInit {
  lessonList!: TeacherOwnLesson[] | null;
  currentDisplayLessonList!: TeacherOwnLesson[] | null;
  temp$ = this.lessonSrvc.teacherOwnLessonList$;
  currentSelectedLesson!: TeacherOwnLesson;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchCodeValue = '';
  visibleSearchCode = false;

  constructor(
    private memberSrvc: MemberService,
    private requestSrvc: RequestService,
    private lessonSrvc: LessonService,
    private message: NzMessageService
  ) {}

  init() {
    this.lessonSrvc.getTeacherOwnLesson().subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
  }
  ngOnInit(): void {
    this.init();
  }

  //查看课程详情
  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
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
      (item: TeacherOwnLesson) =>
        item.title!.indexOf(this.searchTitleValue) !== -1
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
      (item: TeacherOwnLesson) =>
        String(item.code).indexOf(this.searchCodeValue) !== -1
    );
  }
}
