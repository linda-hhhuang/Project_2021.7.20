import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '@core/service/user.service';
import {
  ImportStudent,
  Student,
  Teacher,
  ImportTeacher,
  UpdateStudent,
  UpdateTeacher,
} from '@ta/model/import-member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private studentList = new BehaviorSubject<Student[] | null>(null);
  studentList$ = this.studentList.asObservable();

  private teacherList = new BehaviorSubject<Teacher[] | null>(null);
  teacherList$ = this.teacherList.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    memberSrvc: MemberService,
    private userSrvc: UserService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (memberSrvc) {
      throw new Error(
        'You should not import MemberService which is already imported in root!'
      );
    }
    this.init();
  }

  init() {
    this.userSrvc.memberlist$.subscribe((list) => {
      this.studentList.next(list.studentList);
      this.teacherList.next(list.teacherList);
    });
  }

  getTime() {
    return this.api.get<any>('/member/timerange').pipe(
      tap({
        next: (response) => {
          console.log('in member service getTime()', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  importStudent(importStudent: ImportStudent[]) {
    return this.api.post<any>('/member/import/student', importStudent).pipe(
      tap({
        next: (response) => {
          this.userSrvc.memberInit().subscribe();
          console.log('in member service importStudent ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  importTeacher(importTeacher: ImportTeacher[]) {
    return this.api
      .post<ImportTeacher>('/member/import/teacher', importTeacher)
      .pipe(
        tap({
          next: (response) => {
            this.userSrvc.memberInit().subscribe();
            console.log('in member service importTeacher ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  deleteMember(sid: number) {
    return this.api.delete<any>(`/member/${sid}`).pipe(
      tap({
        next: (response) => {
          this.userSrvc.memberInit().subscribe();
          console.log('in member service deleteMember ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  UpdataStudent(updateInfo: UpdateStudent, sid: number) {
    return this.api
      .put<UpdateStudent>(`/member/student/${sid}`, updateInfo)
      .pipe(
        tap({
          next: (response) => {
            this.userSrvc.memberInit().subscribe();
            console.log('in member service UpdataStudent ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  UpdataTeacher(updateInfo: UpdateTeacher, sid: number) {
    return this.api
      .post<UpdateTeacher>(`/member/teacher/${sid}`, updateInfo)
      .pipe(
        tap({
          next: (response) => {
            this.userSrvc.memberInit().subscribe();
            console.log('in member service UpdataTeacher ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
  }
}
