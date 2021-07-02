import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { WebScanPage } from '../pages/web-scan/web-scan.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  scanSub: any;
  qrText: any;
  Native = true;
  constructor(
    private navC: NavController,
    public platform: Platform,
    private qrScanner: QRScanner,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    // private bcScanner: BarcodeScanner
  ) {
    if (this.platform.is('pwa') || this.platform.is('mobileweb') || this.platform.is('desktop')) {
      this.Native = false;
    }
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
  }
  IDForm = new FormGroup({
    ID: new FormControl('', Validators.compose([Validators.required,Validators.minLength(13),Validators.maxLength(13),Validators.pattern("^[0-9]*$"),Validators.required])),
  
  }, {
    validators: this.validateID.bind(this)
  });

  validateID(formGroup: FormGroup) {
    const { value: ID } = formGroup.get('ID')
    const matchingControl = formGroup.controls['ID'];

    var idnumber = ID,
      invalid = 0;

    // display debugging
    // var debug = $('#debug');

    // check that value submitted is a number
    if (isNaN(idnumber)) {
      // debug.append('Value supplied is not a valid number.<br />');
      invalid++;
    }

    // check length of 13 digits
    if (idnumber.length != 13) {
      // debug.append('Number supplied does not have 13 digits.<br />');
      invalid++;
    }
  

    // check that YYMMDD group is a valid date
    var yy = idnumber.substring(0, 2),
      mm = idnumber.substring(2, 4),
      dd = idnumber.substring(4, 6);

    var dob = new Date(yy, (mm - 1), dd);

    // check values - add one to month because Date() uses 0-11 for months
    if (!(((dob.getFullYear() + '').substring(2, 4) == yy) && (dob.getMonth() == mm - 1) && (dob.getDate() == dd))) {
      // debug.append('Date in first 6 digits is invalid.<br />');
      invalid++;
    }

    // evaluate GSSS group for gender and sequence 
    var gender = parseInt(idnumber.substring(6, 10), 10) > 5000 ? "M" : "F";

    // ensure third to last digit is a 1 or a 0
    if (idnumber.substring(10, 11) > 1) {
      // debug.append('Third to last digit can only be a 0 or 1 but is a ' + idnumber.substring(10, 11) + '.<br />');
      invalid++;
    } else {
      // determine citizenship from third to last digit (C)
      var saffer = parseInt(idnumber.substring(10, 11), 10) === 0 ? "C" : "F";
    }

    // ensure second to last digit is a 8 or a 9
    if (idnumber.substring(11, 12) < 8) {
      // debug.append('Second to last digit can only be a 8 or 9 but is a ' + idnumber.substring(11, 12) + '.<br />');
      invalid++;
    }

    // calculate check bit (Z) using the Luhn algorithm
    var ncheck = 0,
      beven = false;

    for (var c = idnumber.length - 1; c >= 0; c--) {
      var cdigit = idnumber.charAt(c),
        ndigit = parseInt(cdigit, 10);

      if (beven) {
        if ((ndigit *= 2) > 9) ndigit -= 9;
      }

      ncheck += ndigit;
      beven = !beven;
    }

    if ((ncheck % 10) !== 0) {
      // debug.append('Checkbit is incorrect.<br />');
      invalid++;
    }

    // if one or more checks fail, display details
    if (invalid > 0) {
      // debug.css('display', 'block');
    }
   
    return (ncheck % 10) === 0 ? null : matchingControl.setErrors({ validateID: true })
  }


  validation_messages = {
    'ID': [
      { type: 'required', message: 'ID number is required!' },
      { type: 'pattern', message: 'ID number should contain numbers only!' },
      { type: 'minlength', message: 'ID number should contain 13 numbers!'},
      { type: 'maxlength', message: 'ID number should contain 13 numbers!'},
      { type: 'validateID', message: 'Please enter a valid South African ID number!' },
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
  ngOnInit() {
  }

  createEvent() {
    this.navC.navigateForward('settings')
  }

  contactUs() {
    this.navC.navigateForward('contact-us')
  }

  scan2() {
    // this.bcScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData);
    //   this.qrText=barcodeData
    //  }).catch(err => {
    //   this.qrText=err
    //      console.log('Error', err);
    //  });
  }
  scan() {
    // this.counter('GmhcrGsv2HAyZX36LNBV')

    if (this.Native == true) {
      this.nativeFunction();
    }
  }

  nativeFunction() {
    this.qrScanner.prepare().
      then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';
          debugger
          this.scanSub = this.qrScanner.scan()
            .subscribe((textFound: string) => {
              document.getElementsByTagName('body')[0].style.opacity = '1';
              this.qrScanner.hide();
              this.scanSub.unsubscribe();
              this.qrText = textFound;

              // if( textFound.includes("psc-event-counter")==true){
              //   console.log(textFound.includes("psc-event-counter"))
              //   this.counter(textFound.split('=').pop())
              //   this.qrText = textFound.split('=').pop();
              // }
              // if(textFound.includes("psc-event-counter")==false){
              //   this.alertCtrl.create({
              //     header:"Invalid QR code",
              //     message: "Please scan barcode from PSC app",
              //     buttons: ['Ok'],
              //     cssClass: 'custom-alert',
              //   }).then(
              //     alert => alert.present()
              //   );
              //   console.log(textFound.includes("psc-event-counter"))

              // }

            }, (err) => {
              alert(JSON.stringify(err));
            });

        } else if (status.denied) {
        } else {

        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  submit() {
    if (this.IDForm.valid) {

      const navigationExtras: NavigationExtras = {
        queryParams: {
          ID: this.IDForm.value.ID,
        }
      };

      this.navC.navigateForward(['/ticket-form'], navigationExtras);
      this.IDForm.setValue({
        'ID': "",
      });
    } else {
      this.validateAllFormFields(this.IDForm);
    }

  }

  clear(){
    this.IDForm.controls.ID.setValue('');
  }
}
