import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  Lesson,
  ImportLesson,
  Request,
  RequestList,
  InnerRequest,
  OuterRequest,
} from '@ta/model/lesson';
import { StudentAgreement } from '@ta/model/request';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  requestList = new BehaviorSubject<RequestList[] | null>(null);
  requestList$ = this.requestList.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    requestSrvc: RequestService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (requestSrvc) {
      throw new Error(
        'You should not import requestSrvc which is already imported in root!'
      );
    }
  }

  getRequest() {
    return this.api.get<any>('/request/list').pipe(
      tap({
        next: (response) => {
          this.requestList.next(response.body);
          console.log('in request service getRequest', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getRequestInfo(rid: number) {
    return this.api.get<any>(`/request/${rid}`).pipe(
      tap({
        next: (response) => {
          this.requestList.next(response.body);
          console.log('in request service getRequestInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //学生
  deleteRequest(rid: number) {
    return this.api.delete<any>(`/request/${rid}`).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          console.log('in request service deleteRequest ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  updateRequest(request: Request) {
    return this.api
      .put<any>(`/request/${request.rid}/student`, {
        deduction: request.deduction,
        deductTime: request.deductTime,
        studentComment: request.studentComment,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getRequest().subscribe();
            console.log('in request service postRequest ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  createRequestInner(request: InnerRequest) {
    return this.api
      .post<any>('/request/add-inner', {
        lid: request.lessonLid,
        deduction: request.deduction,
        deductTime: request.deductTime,
        studentComment: request.studentComment,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getRequest().subscribe();
            console.log('in request service postRequest ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  createRequestOuter(request: OuterRequest) {
    return this.api
      .post<any>('/request/add-outer', {
        deduction: request.deduction,
        deductTime: request.deductTime,
        lessonTitle: request.lessonTitle,
        lessonCode: request.lessonCode,
        lessonTerm: request.lessonTerm,
        lessonClass: request.lessonClass,
        lessonScore: request.lessonScore,
        lessonStudentNum: request.lessonStudentNum,
        lessonType: request.lessonType,
        teacherName: request.teacherName,
        teacherJob: request.teacherJob,
        teacherOrganization: request.teacherOrganization,
        studentComment: request.studentComment,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getRequest().subscribe();
            console.log('in request service postRequest ok', response);
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
