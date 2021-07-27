import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { UiAntdModule } from '@shared/ui-antd/ui-antd.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { UserService } from './service/user.service';
@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    LoginRedirectComponent,
  ],
  imports: [CommonModule, UiAntdModule, ReactiveFormsModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
      // providers: [UserService],
    };
  }
}
