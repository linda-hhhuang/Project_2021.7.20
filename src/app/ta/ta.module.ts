import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TARoutingModule } from './ta-routing.module';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { AdminComponent } from './components/admin/admin.component';
import { TARedirectComponent } from './components/ta-redirect/ta-redirect.component';

@NgModule({
  declarations: [
    TeacherComponent,
    StudentComponent,
    AdminComponent,
    TARedirectComponent,
  ],
  imports: [CommonModule, TARoutingModule],
})
export class TAModule {}
