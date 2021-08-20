import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { TAGuard } from './service/ta.guard';
import { AdminGuard } from '@ta/services/admin.guard';
import { StudentGuard } from '@ta/services/student.guard';
import { PrintComponent } from './components/print/print.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'ta', pathMatch: 'full' },
      {
        path: 'ta',
        canActivate: [TAGuard],
        loadChildren: () =>
          import('../ta/ta.module').then((mod) => mod.TAModule),
      },
    ],
  },
  {
    path: 'print',
    canActivate: [AdminGuard],
    component: PrintComponent,
  },
  {
    path: 'print/:id',
    canActivate: [StudentGuard],
    component: PrintComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
