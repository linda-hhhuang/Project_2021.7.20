import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { LessonService } from '@ta/services/lesson.service';
import { ImportLesson, Lesson } from '@ta/model/lesson';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Teacher } from '@ta/model/member';
@Component({
  selector: 'app-admin-lesson',
  templateUrl: './admin-lesson.component.html',
  styleUrls: ['./admin-lesson.component.css'],
})
export class AdminLessonComponent implements OnInit {
  // 留个大坑 , 这里的个人信息显示没有做完,现在还不知道咋做,等到其他的完成回来看就行
  lessonList: Lesson[] | null = [];
  currentDisplayLessonList!: Lesson[] | null;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentSelectedLesson!: Lesson;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  isVisibleUpdateLesson = false;
  isOkLoadingUpdateLesson = false;

  isVisibleTeacherChange = false;
  isOkLoadingTeacherChange = false;

  isVisibleAddTeacher = false;
  isOkLoadingAddTeacher = false;
  addTeacherValue: number | undefined = undefined;

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
    console.log('in handleOkUpload, data is ', this.importLessonJSONData);
    this.lessonSrvc
      .importLesson(this.importLessonJSONData)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpload = false;
      });
    this.importLessonList = this.importLessonData = null;
    this.isVisibleUpload = false;
  }
  handleCancelUpload(): void {
    console.log('Button cancel clicked!');
    this.importLessonList = this.importLessonData = null;
    this.isVisibleUpload = false;
  }

  //查看课程所有请求
  showModalShowInfo(e: any) {
    console.log('in ShowInfo ', e);
    this.currentSelectedLesson = e;
    this.lessonSrvc.getLessonInfo(e.lid).subscribe((v) => {
      console.log('in lesson showModalShowInfo', v);
      this.currentSelectedLesson.Requests = v.body.Requests;
    });
    this.isVisibleShowInfo = true;
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  //更新课程
  showModalUpdateLesson(e: Lesson) {
    console.log('in showModalUpdateLesson ', e);
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
    };
    this.isVisibleUpdateLesson = true;
  }
  handleOkUpdateLesson(): void {
    this.isOkLoadingUpdateLesson = true;
    this.lessonSrvc
      .UpdataLesson(this.updateLessonData, this.currentSelectedLesson.lid)
      .subscribe((_) => {
        this.message.success(`成功更新课程信息`);
      });
    this.isOkLoadingUpdateLesson = false;
    this.isVisibleUpdateLesson = false;
  }
  handleCancelUpdateLesson(): void {
    this.isVisibleUpdateLesson = false;
  }

  //教师相关操作
  showModalTeacherChange(e: Lesson) {
    console.log('in showModalTeacherChange ', e);
    this.currentSelectedLesson = e;
    this.isVisibleTeacherChange = true;
  }
  handleOkTeacherChange(): void {
    this.isOkLoadingTeacherChange = true;
    this.isOkLoadingTeacherChange = false;
    this.isVisibleTeacherChange = false;
  }

  //添加教师
  showModalAddTeacher() {
    console.log('in showModalAddTeacher ');
    this.isVisibleAddTeacher = true;
  }
  handleOkAddTeacher(): void {
    this.isOkLoadingAddTeacher = true;
    this.lessonSrvc
      .addTeacher(this.currentSelectedLesson.lid, this.addTeacherValue!)
      .subscribe((_) => {
        this.message.success(`成功添加教师到课程中`);
        this.isOkLoadingAddTeacher = false;
        this.isVisibleTeacherChange = false;
      });
    this.isVisibleAddTeacher = false;
  }
  handleCancelAddTeacher(): void {
    this.isVisibleAddTeacher = false;
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
        console.log('importLessonList', this.importLessonList);
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
          '老师',
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
            teachers: [],
          };
          for (let j = 0; j < this.importLessonJSONHeader.length; j++) {
            let temp;
            if (j == 3) {
              temp = Number(this.importLessonData[i][j]);
            } else if (j == 9) {
              //待测试
              temp = this.importLessonData[i][j]
                .split(' ')
                .map((v: string) => Number(v));
            } else temp = String(this.importLessonData[i][j]);

            c[this.importLessonJSONHeader[j]] = temp;
          }
          this.importLessonJSONData.push(c);
        }
        console.log('importLessonJSONData', this.importLessonJSONData);
        console.log('importLessonHeader', this.importLessonHeader);
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

  deleteTeacherConfirm(teacher: Teacher) {
    this.lessonSrvc
      .deleteTeacher(this.currentSelectedLesson.lid, teacher.sid)
      .subscribe((_) => {
        this.message.success('从课程中删除教师成功!');
        this.isVisibleTeacherChange = false;
      });
  }
  deleteCancel() {}

  filiterTeacherName(l: Teacher[]) {
    return l.map((o) => o.name + '（' + o.sid + '）').join('，');
  }
}
