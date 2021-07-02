import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

 
    constructor(public navC: NavController) { }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return new Promise((resolve, reject) => {
        let eventData = localStorage.getItem('staffNumber')
        if(eventData  == null || eventData=='' || eventData ==undefined ){
          resolve(false);
          this.navC.navigateRoot("sign-in");
        }else{
          resolve(true);
        }
      });
    }
  
}
