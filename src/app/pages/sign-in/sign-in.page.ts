import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  signInDetails={
    email:'',
    password: ''
  }
  constructor(
    private alertCtrl: AlertController,
    private navC: NavController,
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private api: ApiService,
    private toaster: ToasterService,
    // private profileService: ProfileService
  ) { }

  ngOnInit() {
  }
 

  login = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      // Validators.minLength(6), 
      // Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9\d$@$!%*?&].{5,}")
    ])),

  });

  validation_messages = {

    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    'password': [
      { type: 'required', message: 'Password is required!' },
      // { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      // { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],

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


  async loginF() {
   
    if (this.login.valid) {

      
      const loading = this.loadingCtrl.create({
        message: 'Signing in, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();
        this.authService.login(this.signInDetails).subscribe(
          async data => {
            if (data.status == 0) {
              (await loading).dismiss();
              localStorage.setItem('staffNumber', data.data[0].staffNumber);
             
              // localStorage.setItem('', data.data[0].surname + ' ' + data.data[0].name);
              // this.app.isLoggedIn = true;
              // // this.app.openPage('Users');
              // window.location.reload();
              this.login.reset();
              this.navC.navigateForward('tabs/home');
            } else if (data.status == 1) {
              (await loading).dismiss();
              // this.do_activate_user(data.msg);
            } else {
              (await loading).dismiss();
              this.presentAlert(data.msg);
            }
          }, async error => {
            (await loading).dismiss();
            console.log(error);
            
            this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
          }
        )
      
      

    } else {
      this.validateAllFormFields(this.login);
    }
  }



  Forgotpassword = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
  })

  validation_messagesPassword = {
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
  };

  validateAllFormFieldsPassword(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFieldsPassword(control);
      }
    });
  }


  reset() {
    if (this.Forgotpassword.valid) {

      // this.authService.sendPasswordResetEmail(this.Forgotpassword.value.email)
      //   .then((success) => {
      //     this.alertCtrl.create({
      //       message: "Check your Email account",
      //       buttons: ['Ok']
      //     }).then(
      //       alert => alert.present()
      //     );
      //     this.isForgotPassword = true;
      //   }).catch((error) => {
      //     this.alert(error)
      //   })
    } else {
      this.validateAllFormFieldsPassword(this.Forgotpassword);
    }

  }

  async resetPass() {
    let email = this.login.get('email').value;
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Reset Password!',
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Enter your Email',
          cssClass: 'specialClass',
          attributes: {
            inputmode: 'text',
            value: ''
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            const loading = await this.loadingCtrl.create({
              cssClass: 'my-custom-class',
              message: 'Please wait...',
            });
            if (data.email.length < 3) {
              this. alert('Email Required');
            } else {
              await loading.present();
              // this.api.reset_password(
              //   email
              // ).subscribe(
              //   data => {
              //     if (data.status == 0) {
              //       loading.dismiss();
              //       this.toaster.successToast(data.msg);
              //       this. alert('Password reseted check your emails for further instructions!')
              //       console.log(data);
              //     } else {
              //       loading.dismiss();
              //       this. alert(data.msg);
              //     }
              //   }, error => {
              //     loading.dismiss();
              //     this. alert(error.message);
              //   }
              // )
            }
          }
        }
      ]
    });
    await alert.present();
  }
  onSignUp(){
    this.navC.navigateForward('sign-up');
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

}
