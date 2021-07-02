import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';
import { WebScanPageModule } from './pages/web-scan/web-scan.module';
import { TabsPageModule } from './pages/tabs/tabs.module';
 


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    WebScanPageModule,
    TabsPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    FileOpener,
    EmailComposer,
    QRScanner,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
