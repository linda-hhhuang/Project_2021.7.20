import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { AdminMemberComponent } from './components/admin-member/admin-member.component';
import { AdminLessonComponent } from './components/admin-lesson/admin-lesson.component';
import { AdminOperationComponent } from './components/admin-operation/admin-operation.component';
import { AdminExportComponent } from './components/admin-export/admin-export.component';
import { AdminMemberStudentComponent } from './components/admin-member-student/admin-member-student.component';
import { AdminMemberTeacherComponent } from './components/admin-member-teacher/admin-member-teacher.component';
@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminMainComponent,
    AdminMemberComponent,
    AdminLessonComponent,
    AdminOperationComponent,
    AdminExportComponent,
    AdminMemberStudentComponent,
    AdminMemberTeacherComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
