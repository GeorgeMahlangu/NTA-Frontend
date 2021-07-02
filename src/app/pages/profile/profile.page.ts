import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileDetails = {
    firstname: '',
    lastname: '',
    email: '',
    cellnumber: '',
    stuffNumber:'',
  }
  public profileForm: FormGroup;
  public Province: any;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toaster: ToasterService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
  ) {
    this.profileForm = this.fb.group({
      firstname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      lastname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
      cellnumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$"), Validators.required])),
    });
  }

  ngOnInit() {
  }

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Name is required!' },
      { type: 'minlength', message: 'Name should contain atleast 3 letters!' },

    ],
    'lastname': [
      { type: 'required', message: 'Surname is required!' },
      { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },
    ],
    'cellnumber': [
      { type: 'required', message: 'Cell number is required!' },
      { type: 'pattern', message: 'Cell number should contain letters only!' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!' },
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!' },
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

  ionViewWillEnter() {
    if (this.authService.isLoggedin() == false) {
      this.navCtrl.navigateForward("sign-in");
    } else {
      this.doGetUser();
    }
  }

  async doGetUser() {
    this.authService.get_user().subscribe(
      data => {
        if (data.status == 0) {
          this.profileForm.setValue({
            'email': data.data[0].email,
            'lastname': data.data[0].lastname,
            'firstname': data.data[0].firstname,
            'cellnumber': data.data[0].cellnumber,
         
          });
          this.profileForm.controls['email'].disable();
        } else {
          this.presentAlert(data.msg);
        }
      }, error => {
        this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
      }
    );
  }



  async UpdateProfile() {

    console.log(this.profileForm.valid);

    if (this.profileForm.valid) {

      const loading = this.loadingCtrl.create({
        message: 'Updating, Please wait...',
        // showBackdrop: false,
        cssClass: 'custom-loader',
        spinner: "crescent",
      });

      (await loading).present();

      this.api.update_officer(this.profileDetails).subscribe(
        async data => {

          if (data.status == 0) {
            (await loading).dismiss();
            console.log(data);
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
      this.validateAllFormFields(this.profileForm);
    }
  }

  async changePass() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Change Password!',
      inputs: [
        {
          name: 'pass',
          type: 'password',
          placeholder: 'New Password',
          cssClass: 'specialClass',
          attributes: {
            inputmode: 'decimal'
          }
        },
        {
          name: 'pass1',
          type: 'password',
          placeholder: 'Confirm Password',
          cssClass: 'specialClass',
          attributes: {
            inputmode: 'decimal'
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
          handler: (data) => {
            this.doChangePassword(data.pass, data.pass1);
          }
        }
      ]
    });

    await alert.present();
  }

  async doChangePassword(password, password1) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    if (password == '' || password1 == '') {
      this.presentAlert('Password fields required ⚠️');
    } else if (password1 != password) {
      this.presentAlert('Passwords do not match! ❌');
    } 
    // else if (password <6) {
    //   this.presentAlert('Weak Password detected 👎❌');
    // }
    else {
      await loading.present();
      this.api.update_password(password).subscribe(
        data => {
          if (data.status == 0) {
            loading.dismiss();
            this.toaster.successToast(data.msg);
          } else {
            loading.dismiss();
            this.presentAlert(data.msg);
          }
        }, error => {
          loading.dismiss();
          this.presentAlert(error.message);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
   
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
