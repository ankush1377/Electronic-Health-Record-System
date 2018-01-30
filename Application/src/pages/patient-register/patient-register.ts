import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import {PatientSetupPage} from '../patient-setup/patient-setup';

import { UtilityProvider } from '../../providers/utility/utility';
/**
 * Generated class for the PatientRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patient-register',
  templateUrl: 'patient-register.html',
})
export class PatientRegisterPage {

	emailId: string = "";
	password: string = "";
	cpassword: string = "";

  constructor(private storage: Storage, public utilityProvider: UtilityProvider, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }


  registerUser(){
  	
    if(this.password == this.cpassword){
      
      let loading = this.loadingCtrl.create({
        content: 'Creating account...',
        dismissOnPageChange: true
      });

      loading.present();

  		this.afAuth.auth.createUserWithEmailAndPassword(this.emailId, this.password)
  		.then(data=>{
  			console.log('Registered with email ' + this.emailId);
        this.storage.set('emailId', this.emailId);
        this.storage.set('password', this.password);
        loading.dismiss();
  			this.navCtrl.setRoot(PatientSetupPage);
  		})
  		.catch(error=>{
        console.log('Registration error : ', error.message);
        loading.dismiss();
  			this.utilityProvider.showAlert('Error', error.message);
  		})
  	}
  	else{
		  this.utilityProvider.showAlert('Error', 'Both passwords do not match!');
  	}
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientRegisterPage');
  }

}
