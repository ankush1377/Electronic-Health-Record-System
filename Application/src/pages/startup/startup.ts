import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { PatientHomePage } from '../patient-home/patient-home';
import { PatientSetupPage } from '../patient-setup/patient-setup';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';
import { DoctorHomePage } from '../doctor-home/doctor-home';

import { UtilityProvider } from '../../providers/utility/utility';
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

  constructor(public alertCtrl: AlertController, public utilityProvider: UtilityProvider, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage : Storage, public plt: Platform) {
    
     if (plt.is('core') || plt.is('ipad') || plt.is('phablet') || plt.is('tablet') ) {
        navCtrl.setRoot(DoctorHomePage);
        return;
     }
     
     setTimeout(()=>{
       storage.get('emailId').then((val) => {
         this.email = val;
         storage.get('password').then((val) => { this.password = val });
         afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
         .then( data => {
           console.log('Signed in with email '+ this.email);
         })
         .catch((error) => {
           console.log('Login error : ', error.message);
           this.utilityProvider.showAlert('Error', error.message);
         })
         storage.get('firstName').then((val) => {
           navCtrl.setRoot(PatientTabsPage);
         })
         .catch((error) => {
           navCtrl.setRoot(PatientSetupPage);
         })
       })
       .catch((error) => {
         navCtrl.setRoot(PatientHomePage);
       });
		 }, 1500);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StartupPage');
  }

}