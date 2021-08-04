import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Lesson, ImportLesson, Request } from '@ta/model/lesson';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private requestList = new BehaviorSubject<Request[] | null>(null);
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
    return this.api.get<any>('/request/eduadmin').pipe(
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

  passRequest(rid: number) {
    return this.api.post<any>(`/request/eduadmin/${rid}`, null).pipe(
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
    return this.api.delete<any>(`/request/eduadmin/${rid}`).pipe(
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
  }
}
