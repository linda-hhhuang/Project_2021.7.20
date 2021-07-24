import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TARedirectComponent } from './components/ta-redirect/ta-redirect.component';
const routes: Routes = [
  {
    path: '',
    component: TARedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TARoutingModule {}
