import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Lesson, ImportLesson, Request, RequestList } from '@ta/model/lesson';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private requestList = new BehaviorSubject<RequestList[] | null>(null);
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
        'You should not import LessonService which is already imported in root!'
      );
    }
    this.getRequest().subscribe();
  }

  //request部分

  getRequest() {
    return this.api.get<any>('/request/list').pipe(
      tap({
        next: (response) => {
          this.requestList.next(response.body);
          console.log('in Request service getRequest', response);
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
          // this.requestList.next(response.body);
          console.log('in request service getRequestInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }
  passRequest(rid: number) {
    return this.api.put<any>(`/request/${rid}/validate `, null).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          console.log('in Request service passRequest ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleRequest(rid: number) {
    return this.api.delete<any>(`/request/${rid}`).pipe(
      tap({
        next: (response) => {
          this.getRequest().subscribe();
          console.log('in Request service deleteRequest ok', response);
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
