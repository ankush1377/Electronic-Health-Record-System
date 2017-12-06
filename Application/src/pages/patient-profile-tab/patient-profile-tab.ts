import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';

/**
 * Generated class for the PatientProfileTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-patient-profile-tab',
  templateUrl: 'patient-profile-tab.html',
})

export class PatientProfileTabPage {

  uid : string = "";
  emailId : string = "";
  firstName : string = "";
  lastName : string = "";
  gender : string = "";
  dateOfBirth : string = "";


  constructor(private afAuth: AngularFireAuth,  
    public navCtrl: NavController, 
    public navParams: NavParams) {
    
  	this.uid = afAuth.auth.currentUser.uid;
    this.emailId = this.navParams.get('emailId');
    this.firstName = this.navParams.get('firstName');
    this.lastName = this.navParams.get('lastName');
    this.gender = this.navParams.get('gender');
    this.dateOfBirth = this.navParams.get('dateOfBirth');
  }


  logoutUser(){
    console.log('Logging out');
    this.afAuth.auth.signOut;
    this.navCtrl.setRoot(PatientHomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientProfileTabPage');
  }

}