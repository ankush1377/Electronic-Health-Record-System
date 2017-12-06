import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import {PatientSetupPage} from '../patient-setup/patient-setup';

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

	@ViewChild('emailId') emailId;
	@ViewChild('password') password;
	@ViewChild('cpassword') cpassword;

  constructor(private storage: Storage, 
    public alertCtrl: AlertController, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  registerUser(){
  	if(this.password.value == this.cpassword.value){
  		this.afAuth.auth.createUserWithEmailAndPassword(this.emailId.value, this.password.value)
  		.then(data=>{
  			console.log('Registered with email ' + this.emailId.value);
        this.storage.set('emailId', this.emailId.value);
        this.storage.set('password', this.password.value);
  			this.navCtrl.setRoot(PatientSetupPage);
  		})
  		.catch(error=>{
        console.log('Registration error : ', error.message);
  			this.showAlert('Error', error.message);
  		})
  	}
  	else{
		this.showAlert('Error', 'Both passwords do not match!');
  	}
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientRegisterPage');
  }

}
