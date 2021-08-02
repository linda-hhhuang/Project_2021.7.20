import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { AdminMemberComponent } from './components/admin-member/admin-member.component';
import { AdminLessonComponent } from './components/admin-lesson/admin-lesson.component';
import { AdminOperationComponent } from './components/admin-operation/admin-operation.component';
import { AdminExportComponent } from './components/admin-export/admin-export.component';
const routes: Routes = [
  {
    path: '',
    component: AdminMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AdminHomeComponent },
      { path: 'member', component: AdminMemberComponent },
      { path: 'lesson', component: AdminLessonComponent },
      { path: 'operation', component: AdminOperationComponent },
      { path: 'export', component: AdminExportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
