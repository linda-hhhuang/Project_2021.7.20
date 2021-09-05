import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { StudentAllLessonComponent } from './components/student-all-lesson/student-all-lesson.component';
import { StudentApplyComponent } from './components/student-apply/student-apply.component';
import { StudentRequestComponent } from './components/student-request/student-request.component';
// import { StudentAllTeacherComponent } from './components/student-all-teacher/student-all-teacher.component';
const routes: Routes = [
  {
    path: '',
    component: StudentMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      {
        path: 'personal',
        component: StudentPersonalComponent,
      },
      {
        path: 'lesson',
        component: StudentAllLessonComponent,
      },
      // {
      //   path: 'teacher',
      //   component: StudentAllTeacherComponent,
      // },
      {
        path: 'request',
        component: StudentRequestComponent,
      },
      {
        path: 'application',
        component: StudentApplyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
