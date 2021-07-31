import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentNavComponent } from './components/student-nav/student-nav.component';
import { StudentMainComponent } from './components/student-main/student-main.component';
import { StudentPersonalComponent } from './components/student-personal/student-personal.component';
import { StudentAllLessonComponent } from './components/student-all-lesson/student-all-lesson.component';
import { StudentApplyComponent } from './components/student-apply/student-apply.component';

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
