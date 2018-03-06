import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import { DoctorMenuPage } from '../doctor-menu/doctor-menu';

import { UtilityProvider } from '../../providers/utility/utility';

import * as constants from '../../constants';
/**
 * Generated class for the DoctorRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctor-register',
  templateUrl: 'doctor-register.html',
})
export class DoctorRegisterPage {

  doctorInfo: any = {};
	password: string = "";
	cpassword: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private utilityProvider: UtilityProvider,
  	public alertCtrl: AlertController, private afAuth: AngularFireAuth, private storage: Storage,
  	private db: AngularFireDatabase ) {
  }


  registerDoctor(){
  	
  	if(this.doctorInfo.emailId == ""){
      this.utilityProvider.showAlert('Error', 'Please enter email id');
      return;
    }

    if(this.password == ""){
      this.utilityProvider.showAlert('Error', 'Please enter password');
      return;
    }

    if(this.cpassword == ""){
      this.utilityProvider.showAlert('Error', 'Please confirm your password');
      return;
    }

    if(this.doctorInfo.firstName == ""){
      this.utilityProvider.showAlert('Error', 'Please enter first name');
      return;
    }
    
    if(this.doctorInfo.lastName == ""){
      this.utilityProvider.showAlert('Error', 'Please enter last name');
      return;
    }
    
    if(this.doctorInfo.gender == ""){
      this.utilityProvider.showAlert('Error', 'Please select gender');
      return;
    }

    if(this.doctorInfo.dateOfBirth == ""){
      this.utilityProvider.showAlert('Error', 'Please select date of birth');
      return;
    }


    if(this.doctorInfo.hospitalName == ""){
      this.utilityProvider.showAlert('Error', 'Please enter hospital/clinic name');
      return;
    }

    if(this.password == this.cpassword){
  		this.afAuth.auth.createUserWithEmailAndPassword(this.doctorInfo.emailId, this.password)
  		.then(data=>{
  			console.log('Registered with email ' + this.doctorInfo.emailId);
	        this.storage.set('emailId', this.doctorInfo.emailId);
	        this.storage.set('password', this.password);
  		    this.db.list(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + data.uid).push(this.doctorInfo);
          this.doctorInfo['uid'] = data.uid;
          this.navCtrl.setRoot(DoctorMenuPage, this.doctorInfo);
  		})
  		.catch(error=>{
        console.log('Registration error : ', error.message);
  			this.utilityProvider.showAlert('Error', error.message);
  		})
  	}
  	else{
		  this.utilityProvider.showAlert('Error', 'Both passwords do not match!');
  	}
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorRegisterPage');
  }

}
