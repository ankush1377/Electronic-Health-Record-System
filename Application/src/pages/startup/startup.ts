import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { PatientHomePage } from '../patient-home/patient-home';
import { PatientSetupPage } from '../patient-setup/patient-setup';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';
import { DoctorHomePage } from '../doctor-home/doctor-home';
/**
 * Generated class for the StartupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startup',
  templateUrl: 'startup.html',
})
export class StartupPage {

  email : string;
  password : string;

  constructor(public alertCtrl: AlertController, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage : Storage, public plt: Platform) {
    
     if (this.plt.is('core') || this.plt.is('ipad') || this.plt.is('phablet') || this.plt.is('tablet') ) {
        this.navCtrl.setRoot(DoctorHomePage);
        return;
      }
     setTimeout(()=>{
       storage.get('emailId').then((val) => {
         this.email = val;
         storage.get('password').then((val) => { this.password = val });
         this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
         .then( data => {
           console.log('Signed in with email '+ this.email);
         })
         .catch((error) => {
           console.log('Login error : ', error.message);
           this.showAlert('Error', error.message);
         })
         storage.get('firstName').then((val) => {
           this.navCtrl.setRoot(PatientTabsPage);
         })
         .catch((error) => {
           this.navCtrl.setRoot(PatientSetupPage);
         })
       })
       .catch((error) => {
         this.navCtrl.setRoot(PatientHomePage);
       });
		 }, 1500);
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartupPage');
  }

}