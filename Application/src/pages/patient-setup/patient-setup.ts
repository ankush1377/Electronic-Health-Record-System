import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import {PatientHomePage} from '../patient-home/patient-home';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';

import { UtilityProvider } from '../../providers/utility/utility';

import * as constants from '../../constants';
/**
 * Generated class for the PatientSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patient-setup',
  templateUrl: 'patient-setup.html',
})
export class PatientSetupPage {

  patientInfo: any = {};
  uid: string = '';

  constructor(public alertCtrl: AlertController, public utilityProvider: UtilityProvider, 
    private db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams) {

    this.uid = afAuth.auth.currentUser.uid;;
  }

  saveUserCredentials(){
    
    if(!this.validateName(this.patientInfo.firstName)){
      this.utilityProvider.showAlert('Error', 'Please enter a valid first name');
      return;
    }
    
    if(!this.validateName(this.patientInfo.lastName)){
      this.utilityProvider.showAlert('Error', 'Please enter a valid last name');
      return;
    }
    
    if(this.patientInfo.gender == ""){
      this.utilityProvider.showAlert('Error', 'Please select gender');
      return;
    }

    if(this.patientInfo.dateOfBirth == ""){
      this.utilityProvider.showAlert('Error', 'Please select date of birth');
      return;
    }

    console.log('Saving user credentials!');

    this.patientInfo.emailId = this.afAuth.auth.currentUser.email;
    this.db.list(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + this.uid).push(this.patientInfo);

    this.patientInfo['uid'] = this.uid;

    // this.storage.set('firstName', this.firstName);
    // this.storage.set('lastName', this.lastName);
    // this.storage.set('gender', this.gender);
    // this.storage.set('dateOfBirth', this.dateOfBirth);

    this.navCtrl.setRoot(PatientTabsPage, this.patientInfo);
  }


  validateName(name: string){
    if(name.length>0 && /^[a-zA-Z]+$/.test(name))  
      return true;
    return false;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientSetupPage');
  }

}
