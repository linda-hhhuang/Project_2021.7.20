import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';



@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    LoginRedirectComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
