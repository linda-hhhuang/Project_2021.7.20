import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Lesson, ImportLesson, Request, RequestList } from '@ta/model/lesson';
import { StudentAgreement } from '@ta/model/request';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  requestList = new BehaviorSubject<any[] | null>(null);
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
          //console.log('in request service getRequest', response);
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
          //console.log('in request service getRequestInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteRequest(rid: number) {
    return this.api.delete<any>(`/request/${rid}`).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          //console.log('in request service deleteRequest ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  passRequest(rid: number) {
    return this.api.put<any>(`/request/${rid}/pass`, null).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          //console.log('in request service passRequest ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  uploadAgrement(request: Request) {
    return this.api
      .put<StudentAgreement>(`/request/${request.rid}/teacher`, {
        teacherComment: request.teacherComment,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getRequest().subscribe();
            //console.log('in request service uploadAgrement ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  signAgrement(rid: number) {
    return this.api.put<StudentAgreement>(`/request/${rid}/sign`, null).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          //console.log('in request service uploadAgrement ok', response);
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
