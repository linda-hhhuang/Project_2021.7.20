import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  currentTimeFrom!: number;
  currentTimeTo!: number;
  currentStatus: number = 0; //0-未开始,1-进行中,2-已结束

  constructor(
    @SkipSelf()
    @Optional()
    timeSrvc: TimeService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (timeSrvc) {
      throw new Error(
        'You should not import TimeService which is already imported in root!'
      );
    }
  }

  getTime() {
    return this.api.get<any>('/member/timerange').pipe(
      tap({
        next: (response) => {
          this.currentTimeFrom = Number(response.body.start);
          this.currentTimeTo = Number(response.body.end);
          console.log('in user service getTime ok', response);
          const now = Date.now();
          if (now < this.currentTimeFrom) this.currentStatus = 0;
          else if (now > this.currentTimeTo) this.currentStatus = 2;
          else this.currentStatus = 1;
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  setTime(from: number, to: number) {
    return this.api
      .post<any>('/member/timerange', {
        start: from,
        end: to,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentTimeFrom = response.body.start;
            this.currentTimeTo = response.body.end;
            const now = Date.now();
            if (now < this.currentTimeFrom) this.currentStatus = 0;
            else if (now > this.currentTimeTo) this.currentStatus = 2;
            else this.currentStatus = 1;
            console.log('in user service setTime ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  formatDateTime(date: Date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mm = m < 10 ? '0' + m : m;
    let d = date.getDate();
    let dd = d < 10 ? '0' + d : d;
    let h = date.getHours();
    let hh = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let minuteS = minute < 10 ? '0' + minute : minute;
    let secondS = second < 10 ? '0' + second : second;
    return y + '-' + mm + '-' + dd + ' ' + hh + ':' + minuteS + ':' + secondS;
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
  }
}
