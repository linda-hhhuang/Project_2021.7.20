import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TARedirectComponent } from './components/ta-redirect/ta-redirect.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './services/admin.guard';
import { StudentGuard } from './services/student.guard';
import { TeacherGuard } from './services/teacher.guard';

const routes: Routes = [
  {
    path: '',
    component: TARedirectComponent,
  },
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    component: TeacherComponent,
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    component: StudentComponent,
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TARoutingModule {}
