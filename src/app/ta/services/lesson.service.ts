import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  Lesson,
  ImportLesson,
  Request,
  TeacherOwnLesson,
} from '@ta/model/lesson';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private lessonList = new BehaviorSubject<Lesson[] | null>(null);
  lessonList$ = this.lessonList.asObservable();

  private lessonInfo = new BehaviorSubject<Lesson[] | null>(null);
  lessonInfo$ = this.lessonInfo.asObservable();

  private teacherOwnLessonList = new BehaviorSubject<TeacherOwnLesson[]>([]);
  teacherOwnLessonList$ = this.teacherOwnLessonList.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    lessonSrvc: LessonService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (lessonSrvc) {
      throw new Error(
        'You should not import LessonService which is already imported in root!'
      );
    }
    this.getLesson().subscribe();
  }

  getLesson() {
    return this.api.get<any>('/lesson/').pipe(
      tap({
        next: (response) => {
          this.lessonList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getLessonInfo(lid: number) {
    return this.api.get<any>(`/lesson/${lid}`).pipe(
      tap({
        next: (response) => {
          this.lessonInfo.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacherOwnLesson() {
    return this.api.get<any>('/lesson/my-lesson').pipe(
      tap({
        next: (response) => {
          this.teacherOwnLessonList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  importLesson(importlesson: ImportLesson[]) {
    return this.api.post<any>('/lesson/import', importlesson).pipe(
      tap({
        next: (response) => {
          this.getLesson().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  UpdataLesson(updateInfo: ImportLesson, lid: number) {
    return this.api.put<ImportLesson>(`/lesson/${lid}`, updateInfo).pipe(
      tap({
        next: (response) => {
          this.getLesson().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteLesson(lid: number) {
    return this.api.delete<any>(`/lesson/${lid}`).pipe(
      tap({
        next: (response) => {
          this.getLesson().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  addTeacher(lid: number, sid: number) {
    return this.api.post<any>(`/lesson/${lid}/teacher/${sid}`, null).pipe(
      tap({
        next: (response) => {
          this.getLesson().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteTeacher(lid: number, sid: number) {
    return this.api.delete<any>(`/lesson/${lid}/teacher/${sid}`).pipe(
      tap({
        next: (response) => {
          this.getLesson().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
