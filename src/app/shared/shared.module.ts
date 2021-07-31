import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiAntdModule } from './ui-antd/ui-antd.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [],
  imports: [CommonModule, UiAntdModule, FormsModule, ReactiveFormsModule],
  exports: [UiAntdModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
