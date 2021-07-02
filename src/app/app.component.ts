import { Component, OnInit } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private menuCtrl: MenuController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#202020');
      this.splashScreen.hide();
      this.menuCtrl.enable(false);
    });
  }

  ngOnInit() {
    let eventData = localStorage.getItem('staffNumber')

    if(eventData  == null || eventData=='' || eventData ==undefined ){
       this.router.navigateByUrl("sign-in");
    }else{
      this.router.navigateByUrl("tabs/home");
    }

    // this.router.navigateByUrl("ticket-form")
  }
}
