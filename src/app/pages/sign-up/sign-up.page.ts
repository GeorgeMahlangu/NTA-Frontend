import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signUpdetails = {
    firstname: '',
    lastname: '',
    email: '',
    cellnumber: '',
    password: '',
  }
  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toaster: ToasterService,
    private navC : NavController
  ) { }

  ngOnInit() {
  }
  signUp = new FormGroup({
    firstname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
    lastname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
    // ID: new FormControl('', Validators.compose([Validators.required])),
    cellnumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10),   Validators.pattern("^[0-9]*$"),Validators.required])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),
      //  Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9\d$@$!%*?&].{5,}")
    ])),
    cpassword: new FormControl('', Validators.required)
  }, {
    validators: this.passwordMatcher.bind(this)
  });

  passwordMatcher(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password')
    const { value: cpassword } = formGroup.get('cpassword')
    const matchingControl = formGroup.controls['cpassword'];
    if (matchingControl.errors && !matchingControl.errors.passwordMatcher) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    return password === cpassword ? null : matchingControl.setErrors({ passwordMatcher: true })
  }

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Firstname is required!' },
      { type: 'minlength', message: 'Firstname should contain atleast 3 letters!' },
   
    ],
    'lastname': [
      { type: 'required', message: 'Lastname is required!' },
      { type: 'minlength', message: 'Lastname should contain atleast 3 letters!' },
    ],
    'cellnumber':[
      { type: 'required', message: 'Cell number is required!' },
      { type: 'pattern', message: 'Cell number should contain numbers only!' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!'},
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!'},
    ],
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    'ID': [
      { type: 'required', message: 'ID is required!' },
      // { type: 'pattern', message: 'ID should contain letters only!' },
      // { type: 'minlength', message: 'ID should contain atleast 3 letters!' },
    ],
    'password': [
      { type: 'required', message: 'Password is required!' },
      { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],
    'cpassword': [
      { type: 'required', message: 'Confirm password is required!' },
      { type: 'passwordMatcher', message: 'Passwords dont match!' },
    ]
  };

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async signUpF() {

    console.log(this.signUp.valid);

    if (this.signUp.valid) {

      const loading = this.loadingCtrl.create({
        message: 'Signing up, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();

      this.api.register(this.signUpdetails).subscribe(
        async data => {

          if (data.status == 0) {
            (await loading).dismiss();
            console.log(data);
            this.navC.navigateForward("sign-in")
            this.toaster.successToast(data.msg);

          } else {
            (await loading).dismiss();
            this.presentAlert(data.msg);
          }
        }, async error => {
          (await loading).dismiss();
          this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
        })

    } else {
      this.validateAllFormFields(this.signUp);
    }
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'NTA',
      subHeader: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  alert(err) {

    this.alertCtrl.create({
      message: err.message,
      buttons: ['Ok'],
      cssClass: 'custom-alert',
    }).then(
      alert => alert.present()
    );
  }

}
