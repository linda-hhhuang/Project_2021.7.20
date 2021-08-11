import { Component, OnInit } from '@angular/core';
import { TimeService } from '@ta/services/time.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
})
export class StudentHomeComponent implements OnInit {
  currentTimeFrom!: string;
  currentTimeTo!: string;

  currentStatus: number = 0; //0-未开始,1-进行中,2-已结束
  status = ['未开始', '进行中', '已结束'];

  constructor(
    private timeSrvc: TimeService,
    private message: NzMessageService
  ) {}

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
}
