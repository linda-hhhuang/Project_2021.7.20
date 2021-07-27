import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { HomeRoutingModule } from './home-routing.module';
import { NavComponent } from './components/nav/nav.component';
import { UiAntdModule } from '@shared/ui-antd/ui-antd.module';
@NgModule({
  declarations: [HomeComponent, MainComponent, NavComponent],
  imports: [CommonModule, HomeRoutingModule, UiAntdModule],
})
export class HomeModule {}
