import { Component, OnInit } from '@angular/core';
import { TimeService } from '@ta/services/time.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  date!: Date[];
  setTimeFrom!: number;
  setTimeTo!: number;
  currentTimeFrom!: string;
  currentTimeTo!: string;

  currentStatus: number = 0; //0-未开始,1-进行中,2-已结束
  status = ['未开始', '进行中', '已结束'];

  isVisibleSetTime = false;
  isOkLoadingSetTime = false;

  constructor(
    private timeSrvc: TimeService,
    private message: NzMessageService
  ) {}

  onSetTimeChange(result: Date[]): void {
    console.log('date 0 : ', this.date[0].getTime());
    console.log('date 1 : ', this.date[1].getTime());
    this.setTimeFrom = this.date[0].getTime();
    this.setTimeTo = this.date[1].getTime();
  }

  getWeek(result: Date[]): void {}

  ngOnInit(): void {
    this.timeSrvc.getTime().subscribe((res) => {
      this.currentTimeFrom = this.timeSrvc.formatDateTime(
        new Date(this.timeSrvc.currentTimeFrom)
      );
      this.currentTimeTo = this.timeSrvc.formatDateTime(
        new Date(this.timeSrvc.currentTimeTo)
      );
      this.currentStatus = this.timeSrvc.currentStatus;
    });
  }

  showModalSetTime() {
    console.log('in SetTime ');
    this.isVisibleSetTime = true;
  }

  handleOkSetTime(): void {
    this.isOkLoadingSetTime = true;
    this.timeSrvc.setTime(this.setTimeFrom, this.setTimeTo).subscribe((res) => {
      this.currentTimeFrom = this.timeSrvc.formatDateTime(
        new Date(this.timeSrvc.currentTimeFrom)
      );
      this.currentTimeTo = this.timeSrvc.formatDateTime(
        new Date(this.timeSrvc.currentTimeTo)
      );
      this.currentStatus = this.timeSrvc.currentStatus;
      this.message.success('时间修改成功!');
      this.isOkLoadingSetTime = false;
    });
    this.isVisibleSetTime = false;
  }

  handleCancelSetTime(): void {
    this.isVisibleSetTime = false;
  }
}
