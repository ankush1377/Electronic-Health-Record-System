import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { PatientLoginPage } from '../patient-login/patient-login';
import { PatientRegisterPage } from '../patient-register/patient-register';

/**
 * Generated class for the PatientHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patient-home',
  templateUrl: 'patient-home.html',
})
export class PatientHomePage {

  constructor( public navCtrl: NavController ) {
  }

  signIn(){
    console.log('Clicked sign in');
  	this.navCtrl.push(PatientLoginPage);
  }

  register(){
    console.log('Clicked register');
  	this.navCtrl.push(PatientRegisterPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientHomePage');
  }

}
