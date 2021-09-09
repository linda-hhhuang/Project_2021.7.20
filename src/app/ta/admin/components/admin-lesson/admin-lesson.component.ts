import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { LessonService } from '@ta/services/lesson.service';
import { ImportLesson, Lesson } from '@ta/model/lesson';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-lesson',
  templateUrl: './admin-lesson.component.html',
  styleUrls: ['./admin-lesson.component.css'],
})
export class AdminLessonComponent implements OnInit {
  lessonList: Lesson[] | null = [];
  currentDisplayLessonList!: Lesson[] | null;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentSelectedLesson!: Lesson;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  isVisibleUpdateLesson = false;
  isOkLoadingUpdateLesson = false;

  searchTitleValue = '';
  visibleSearchTitle = false;

  searchCodeValue = '';
  visibleSearchCode = false;

  importLessonList: any;
  importLessonHeader: any;
  importLessonData: any;
  importLessonJSONData: ImportLesson[] = [];
  importLessonJSONHeader!: Array<string>;

  //表单
  updateLessonData: ImportLesson = {
    code: '',
    title: '',
    description: '',
    maxPass: 0,
    class: '',
    score: '',
    studentNum: '',
    type: '',
    term: '',
    teachers: '',
    teacherJobs: '',
  };

  constructor(
    private lessonSrvc: LessonService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.lessonSrvc.lessonList$.subscribe((v) => {
      this.currentDisplayLessonList = v;
      this.lessonList = v;
    });
  }

  //导入课程
  showModalUpload(): void {
    this.isVisibleUpload = true;
  }
  handleOkUpload(): void {
    this.isOkLoadingUpload = true;
    this.lessonSrvc
      .importLesson(this.importLessonJSONData)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpload = false;
        this.isVisibleUpload = false;
      });
    this.importLessonList = this.importLessonData = null;
  }
  handleCancelUpload(): void {
    this.importLessonList = this.importLessonData = null;
    this.isVisibleUpload = false;
  }

  //查看课程所有请求
  showModalShowInfo(e: any) {
    this.currentSelectedLesson = e;
    this.isVisibleShowInfo = true;
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  //更新课程
  showModalUpdateLesson(e: any) {
    this.currentSelectedLesson = e;
    this.updateLessonData = {
      code: e.code,
      title: e.title,
      description: e.description,
      maxPass: e.maxPass,
      class: e.class,
      score: e.score,
      studentNum: e.studentNum,
      type: e.type,
      term: e.term,
      teachers: e.teachers,
      teacherJobs: e.teacherJobs,
    };
    this.isVisibleUpdateLesson = true;
  }
  handleOkUpdateLesson(): void {
    this.isOkLoadingUpdateLesson = true;
    this.lessonSrvc
      .UpdataLesson(this.updateLessonData, this.currentSelectedLesson.lid)
      .subscribe((_) => {
        this.message.success(`成功更新课程信息`);
        this.isOkLoadingUpdateLesson = false;
        this.isVisibleUpdateLesson = false;
      });
  }
  handleCancelUpdateLesson(): void {
    this.isVisibleUpdateLesson = false;
  }

  //按课程名搜索
  resetTitle(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }
  searchTitle(): void {
    this.visibleSearchTitle = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) => item.title!.indexOf(this.searchTitleValue) !== -1
    );
  }

  //按课程代码搜索
  resetCode(): void {
    this.searchCodeValue = '';
    this.searchCode();
  }
  searchCode(): void {
    this.visibleSearchCode = false;
    this.currentDisplayLessonList = this.lessonList!.filter(
      (item: Lesson) => String(item.code).indexOf(this.searchCodeValue) !== -1
    );
  }

  beforeUpload = (file: any): boolean => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.importLessonList = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.importLessonHeader = [
          '课程代码',
          '课程名称',
          '课程描述',
          '助教数量',
          '班级',
          '学分',
          '学生数量',
          '课程类型',
          '学期',
          '教师',
        ];
        this.importLessonJSONHeader = [
          'code',
          'title',
          'description',
          'maxPass',
          'class',
          'score',
          'studentNum',
          'type',
          'term',
          'teachers',
        ];
        this.importLessonData = this.importLessonList.slice(1); //获得表头字段
        this.importLessonJSONData = [];
        for (let i = 0; i < this.importLessonData.length; i++) {
          let c: ImportLesson = {
            code: '',
            title: '',
            description: '',
            maxPass: 0,
            class: '',
            score: '',
            studentNum: '',
            type: '',
            term: '',
            teachers: '',
            teacherJobs: '',
          };
          for (let j = 0; j < this.importLessonJSONHeader.length; j++) {
            let temp;
            if (j == 3) {
              temp = Number(this.importLessonData[i][j]);
            } else temp = String(this.importLessonData[i][j]);
            c[this.importLessonJSONHeader[j]] = temp;
          }
          this.importLessonJSONData.push(c);
        }
      };
      reader.readAsBinaryString(file);
    }
    return false;
  };

  deleteLessonConfirm(lesson: Lesson) {
    this.lessonSrvc.deleteLesson(lesson.lid).subscribe((_) => {
      this.message.success('删除课程成功!');
    });
  }

  deleteCancel() {}
}
