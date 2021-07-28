import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
@NgModule({
  declarations: [AdminHomeComponent, AdminNavComponent, AdminMainComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
