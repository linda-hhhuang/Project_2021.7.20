import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { StudentAllLessonComponent } from './components/student-all-lesson/student-all-lesson.component';
import { StudentApplyComponent } from './components/student-apply/student-apply.component';
import { SharedModule } from '@shared/shared.module';
import { StudentAllTeacherComponent } from './components/student-all-teacher/student-all-teacher.component';
import { StudentRequestComponent } from './components/student-request/student-request.component';

@NgModule({
  declarations: [
    StudentHomeComponent,
    StudentMainComponent,
    StudentPersonalComponent,
    StudentAllLessonComponent,
    StudentApplyComponent,
    StudentAllTeacherComponent,
    StudentRequestComponent,
  ],
  imports: [CommonModule, StudentRoutingModule, SharedModule],
})
export class StudentModule {}
