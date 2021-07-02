import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebScanPage } from './web-scan.page';

const routes: Routes = [
  {
    path: '',
    component: WebScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebScanPageRoutingModule {}
