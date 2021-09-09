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

  currentLesson!: TeacherOwnLesson;

  searchTitleValue = '';
  visibleSearchTitle = false;

  isVisibleClass = false;
  isOkLoadingClass = false;

  searchCodeValue = '';
  visibleSearchCode = false;

  constructor(
    private lessonSrvc: LessonService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.lessonSrvc.getTeacherOwnLesson().subscribe();
    this.lessonSrvc.teacherOwnLessonList$.subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
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

  //Class
  showModalClass(data: TeacherOwnLesson): void {
    this.isVisibleClass = true;
    this.currentLesson = data;
  }
  handleOkClass(): void {
    this.isOkLoadingClass = true;
    const updateLessonData = {
      code: this.currentLesson.code,
      title: this.currentLesson.title,
      description: this.currentLesson.description,
      maxPass: this.currentLesson.maxPass,
      class: this.currentLesson.class,
      score: this.currentLesson.score,
      studentNum: this.currentLesson.studentNum,
      type: this.currentLesson.type,
      term: this.currentLesson.term,
      teachers: this.currentLesson.teachers,
      teacherJobs: this.currentLesson.teacherJobs,
    };
    this.lessonSrvc
      .UpdataLesson(updateLessonData, this.currentLesson.lid)
      .subscribe((_) => {
        this.message.success(`成功修改课程描述`);
        this.isOkLoadingClass = false;
        this.isVisibleClass = false;
        this.ngOnInit();
      });
  }
  handleCancelClass(): void {
    //console.log('Button cancel clicked!');
    this.isOkLoadingClass = false;
    this.isVisibleClass = false;
  }
}
