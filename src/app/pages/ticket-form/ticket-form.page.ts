import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.page.html',
  styleUrls: ['./ticket-form.page.scss'],
})
export class TicketFormPage implements OnInit {

  ticketDetails = {
    id: "",
    firstname: '',
    lastname: "",
    address: "",
    licenceCode: "",
    PrDP: "",
    cellnumber: "",
    email: "",
    licenceDisk: "",
    vehicleType: "",
    model: "",
    vehicleColour: "",
    vehicleOwner: "",
    vehicleRegisteredAddress: "",
    chargeCode: "",
    chargeType: "",
    penalty: "",
    dateIssued: "",
    expiryDate:'',
    staffNumber: "",
    lastPaymentDate: ""
  }

  public ticketForm: FormGroup;
  public Province: any;
  constructor(
    private fb: FormBuilder,
    private Aroute: ActivatedRoute,
    private api: ApiService,
    private toaster: ToasterService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
  ) {
    this.Aroute.queryParams
      .subscribe(params => {
        if (params && params.ID) {
          this.ticketDetails.id = params.ID
        }
      });
    this.ticketForm = this.fb.group({
      id: [this.ticketDetails.id, Validators.required],
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])],
      cellnumber: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$"), Validators.required])],
      address: ['', Validators.required],
      licenceCode: ['', Validators.required],
      PrDP: ['', Validators.required],
      vehicleOwner: ['', Validators.required],
      vehicleRegisteredAddress: ['', Validators.required],
      vehicleType: ['', Validators.required],
      model: ['', Validators.required],
      licenceDisk: ['', Validators.required],
      vehicleColour: ['', Validators.required],
      chargeCode: ['', Validators.required],
      chargeType: ['', Validators.required],
      penalty: ['', Validators.required],
      dateIssued:['', Validators.required],
      expiryDate:['', Validators.required],
    });
    
  }




  validation_messages = {
    id: [
      { type: 'required', message: 'ID number is required!' },
    ],
    email: [
      { type: 'required', message: 'Email required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    firstname: [
      { type: 'required', message: 'First Name is required!' },
      { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },

    ],
    lastname: [
      { type: 'required', message: 'last Name is required!' },
      { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },
    ],
    cellnumber: [
      { type: 'required', message: 'Cell Number is required!' },
      { type: 'pattern', message: 'Cell number should contain numbers only!' },
      { type: 'minlength', message: 'Cell number should contain 10 numbers!' },
      { type: 'maxlength', message: 'Cell number should contain 10 numbers!' },
    ],
    address: [
      { type: 'required', message: 'Address is required!' },
    ],
    licenceCode: [
      { type: 'required', message: 'Licence Code is required!' },
    ],
    PrDP: [
      { type: 'required', message: 'PrDP is required!' },
    ],
    vehicleOwner: [
      { type: 'required', message: 'Vehicle Owner is required!' },
    ],
    vehicleRegisteredAddress: [
      { type: 'required', message: 'Vehicle Registered Address is required!' },
    ],
    vehicleType: [
      { type: 'required', message: 'Vehicle Type is required!' },
    ],
    model: [
      { type: 'required', message: 'Model is required!' },
    ],
    licenceDisk: [
      { type: 'required', message: 'Licence Disk is required!' },
    ],
    vehicleColour: [
      { type: 'required', message: 'Vehicle Colour is required!' },
    ],
    chargeCode: [
      { type: 'required', message: 'Charge Code is required!' },
    ],
    chargeType: [
      { type: 'required', message: 'Charge Type is required!' },
    ],
    penalty: [
      { type: 'required', message: 'Penalty is required!' },
    ],
    expiryDate:[
      { type: 'required', message: 'Expiry date is required!' },
    ],
    dateIssued:[
      { type: 'required', message: 'Date Issued is required!' },
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

 

  async submit() {
    console.log(this.ticketDetails)
    console.log(this.ticketDetails.expiryDate.substr(0, 10))
    if (this.ticketForm.valid) {
      console.log("valid")
      const loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
  
      await loading.present();
      this.api.add_ticket(this.ticketDetails).subscribe(
        data => {
          if (data.status == 0) {
            loading.dismiss();
            this.toaster.successToast(data.msg);
           
            this.navCtrl.navigateForward("tabs/home");
            this.ticketForm.reset()
            console.log(data);
          } else {
            loading.dismiss();
            this.presentAlert(data.msg);
            console.log(data.err);
          }
        }, error => {
          loading.dismiss();
          console.log(error)
          this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
        }
      );

    } else {
      this.validateAllFormFields(this.ticketForm);
    }

  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Air Food ✈️',
      subHeader: 'Caution',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
