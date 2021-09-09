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
} from '@ta/model/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private studentList = new BehaviorSubject<Student[] | null>(null);
  studentList$ = this.studentList.asObservable();

  private teacherList = new BehaviorSubject<Teacher[] | null>(null);
  teacherList$ = this.teacherList.asObservable();

  private currentStudent = new BehaviorSubject<Student | null>(null);
  currentStudent$ = this.currentStudent.asObservable();

  private currentTeacher = new BehaviorSubject<Teacher | null>(null);
  currentTeacher$ = this.currentTeacher.asObservable();

  private teacherInfoList = new BehaviorSubject<Teacher[] | null>(null);
  teacherInfoList$ = this.teacherInfoList.asObservable();

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
  }

  //教务端
  memberlistInit() {
    this.userSrvc.memberlist$.subscribe((list) => {
      this.studentList.next(list.studentList);
      this.teacherList.next(list.teacherList);
    });
  }

  importStudent(importStudent: ImportStudent[]) {
    return this.api.post<any>('/member/import/student', importStudent).pipe(
      tap({
        next: (response) => {
          this.userSrvc.memberInit().subscribe();
          //console.log('in member service importStudent ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  importTeacher(importTeacher: ImportTeacher[]) {
    return this.api.post<any>('/member/import/teacher', importTeacher).pipe(
      tap({
        next: (response) => {
          this.userSrvc.memberInit().subscribe();
          //console.log('in member service importTeacher ok', response);
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
          //console.log('in member service deleteMember ok', response);
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
            //console.log('in member service UpdataStudent ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  UpdataTeacher(updateInfo: UpdateTeacher, sid: number) {
    return this.api
      .put<UpdateTeacher>(`/member/teacher/${sid}`, updateInfo)
      .pipe(
        tap({
          next: (response) => {
            this.userSrvc.memberInit().subscribe();
            //console.log('in member service UpdataTeacher ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  getStudent(sid: number) {
    return this.api.get<any>(`/member/student/${sid}`).pipe(
      tap({
        next: (response) => {
          //console.log('in member service getStudentInfo', response);
          this.currentStudent.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacher(sid: number) {
    return this.api.get<any>(`/member/teacher/${sid}`).pipe(
      tap({
        next: (response) => {
          //console.log('in member service getTeacherInfo', response);
          this.currentTeacher.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacherInfoList() {
    return this.api.get<any>(`member/teacher/list`).pipe(
      tap({
        next: (response) => {
          //console.log('in member service getTeacherInfoList', response);
          this.teacherInfoList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //学生端
  getStudentInfo() {
    return this.api.get<any>('/member/student/me').pipe(
      tap({
        next: (response) => {
          //console.log('in member service getStudentInfo', response);
          this.currentStudent.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  updateStudentInfo(update: Student) {
    return this.api
      .put<any>('member/student/me', { info: update.info, sign: update.sign })
      .pipe(
        tap({
          next: (response) => {
            this.getStudentInfo().subscribe();
            //console.log('in member service updateStudentInfo ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  //教师端
  getTeacherInfo() {
    return this.api.get<any>('/member/teacher/me').pipe(
      tap({
        next: (response) => {
          //console.log('in member service getTeacherInfo', response);
          this.currentTeacher.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  updateTeacherInfo(update: Teacher) {
    return this.api
      .put<any>('member/teacher/me', { info: update.info, sign: update.sign })
      .pipe(
        tap({
          next: (response) => {
            this.getTeacherInfo().subscribe();
            //console.log('in member service updateTeacherInfo ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  //all

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
