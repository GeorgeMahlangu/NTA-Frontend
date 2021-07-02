import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  data = false
  ticketList:any;
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
  
  }

  updateTicket() {
   
  }

  users: any[];
  count = 0;
  async init(){
    this.api.get_officer_tickets().subscribe(
      data => {
        if (data.status == 0) {
          console.log(data.data);
          this.ticketList = data.data;
          this.count = data.data.length;
          this.data=true
        } else {
          this.data=true
          this.presentAlert(data.msg);
        }
      }, error => {
        this.data=true
        this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
       
      }
    );
  }

  ionViewWillEnter() {
    if (this.authService.isLoggedin() == false) {
      // this.router.navigateByUrl('home');
    }else{
      this.init();
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


  async deleteTicket(ref) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: 'Do you want to delete this ticket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'yes',
          handler: data => {
            this.api.remove_ticket(ref).subscribe(
              data => {
                if (data.status == 0) {
                  this.toaster.successToast(data.msg);
                  this.ionViewWillEnter()
                } else {
                  this.presentAlert(data.msg);
                }
              }, error => {
            
                this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
              }
            );
          }
        }
      ]
    });

    await alert.present();

  }
}
