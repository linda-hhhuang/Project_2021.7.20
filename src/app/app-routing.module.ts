import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@core/components/login/login.component';
import { LoginRedirectComponent } from '@core/components/login-redirect/login-redirect.component';
import { ResetPasswordComponent } from '@core/components/reset-password/reset-password.component';
import { AuthGuard } from '@core/service/auth.guard';

const routes: Routes = [
  { path: '', component: LoginRedirectComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./home/home.module').then((mod) => mod.HomeModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
