import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { TAGuard } from './service/ta.guard';
import { ManagementComponent } from './components/management/management.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'system', pathMatch: 'full' },
      { path: 'system', component: HomeComponent },
      { path: 'management', component: ManagementComponent },
      {
        path: 'ta',
        //验证是否属于member中的一员,不是则弹消息,是则正常加载
        canActivate: [TAGuard],
        loadChildren: () =>
          import('../ta/ta.module').then((mod) => mod.TAModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
