import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
        private router: Router,
        private navC: NavController
    ) {

    }

    //login
    login(signInDetails) {
        return this.http.post<any>(this.api._Url + 'login', signInDetails);
    }

    auth(staffNumber): void {
        localStorage.setItem('staffNumber', staffNumber);
        this.router.navigateByUrl('home');
    }

    isLoggedin(): Boolean {
        if (localStorage.getItem('staffNumber')) {
            return true;
        } else {
            return false;
        }
    }

    get_user() {
        var staffNumber = localStorage.getItem('staffNumber');
        return this.http.post<any>(this.api._Url + 'getUser', { staffNumber });
    }

    logout() {
        localStorage.removeItem('staffNumber');
        this.navC.navigateForward('sign-in')
    }
}
