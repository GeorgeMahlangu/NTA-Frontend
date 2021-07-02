import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebScanPageRoutingModule } from './web-scan-routing.module';

import { WebScanPage } from './web-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebScanPageRoutingModule
  ],
  declarations: [WebScanPage]
})
export class WebScanPageModule {}
