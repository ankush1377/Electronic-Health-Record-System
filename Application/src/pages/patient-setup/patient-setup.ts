import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import {PatientHomePage} from '../patient-home/patient-home';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';

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

	uid : string;
  firstName : string;
  lastName : string;
  gender : string;
  dateOfBirth : string;

  constructor(public alertCtrl: AlertController, 
    private db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams) 
  {
    this.uid = afAuth.auth.currentUser.uid;
    this.firstName = "";
    this.lastName = "";
    this.gender = "";
    this.dateOfBirth = "";
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  logoutUser(){
    console.log('Logging out');
    this.afAuth.auth.signOut;
    this.navCtrl.setRoot(PatientHomePage);
  }

  saveUserCredentials(){
    
    if(this.firstName == ""){
      this.showAlert('Error', 'Please enter first name');
      return;
    }
    
    if(this.lastName == ""){
      this.showAlert('Error', 'Please enter last name');
      return;
    }
    
    if(this.gender == ""){
      this.showAlert('Error', 'Please select gender');
      return;
    }

    if(this.dateOfBirth == ""){
      this.showAlert('Error', 'Please select date of birth');
      return;
    }

    console.log('Saving user credentials!');

    var user = {
      uid: this.afAuth.auth.currentUser.uid,
      emailId: this.afAuth.auth.currentUser.email,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth
    };
    
    this.db.list('/credentials/patients/' + this.afAuth.auth.currentUser.uid).push({
      emailId : user.emailId,
      firstName : user.firstName,
      lastName : user.lastName,
      gender : user.gender,
      dateOfBirth : user.dateOfBirth
    });

    // this.storage.set('firstName', this.firstName);
    // this.storage.set('lastName', this.lastName);
    // this.storage.set('gender', this.gender);
    // this.storage.set('dateOfBirth', this.dateOfBirth);

    this.navCtrl.setRoot(PatientTabsPage, user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientSetupPage');
  }

}
