import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentNavComponent } from './components/student-nav/student-nav.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { StudentAllLessonComponent } from './components/student-all-lesson/student-all-lesson.component';
import { StudentApplyComponent } from './components/student-apply/student-apply.component';


@NgModule({
  declarations: [
    StudentHomeComponent,
    StudentNavComponent,
    StudentMainComponent,
    StudentPersonalComponent,
    StudentAllLessonComponent,
    StudentApplyComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
