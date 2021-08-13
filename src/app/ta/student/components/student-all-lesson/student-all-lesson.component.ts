import { Component, OnInit } from '@angular/core';
import { LessonService } from '@ta/services/lesson.service';
import { Lesson } from '@ta/model/lesson';
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

  searchCodeValue = '';
  visibleSearchCode = false;

  constructor(private lessonSrvc: LessonService) {}

  ngOnInit(): void {
    this.lessonSrvc.lessonList$.subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
  }

  //查看课程所有请求
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
      (item: Lesson) => item.title!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按课程lid搜索
  resetCode(): void {
    this.searchCodeValue = '';
    this.searchCode();
  }
  searchCode(): void {
    this.visibleSearchCode = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) => String(item.lid).indexOf(this.searchCodeValue) !== -1
    );
  }
  Cancel() {}
}
