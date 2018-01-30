import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { DoctorRegisterPage } from '../doctor-register/doctor-register';
import { DoctorMenuPage } from '../doctor-menu/doctor-menu';

import { UtilityProvider } from '../../providers/utility/utility';

import * as constants from '../../constants';
/**
 * Generated class for the DoctorHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation. 
 */

@IonicPage({
	name: 'doctor-home-page',
	segment: 'doctor'
})
@Component({
  selector: 'page-doctor-home',
  templateUrl: 'doctor-home.html',
})
export class DoctorHomePage {

	emailId: string = '';
	password: string = '';
  database: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private utilityProvider: UtilityProvider,
  	public alertCtrl: AlertController, private afAuth: AngularFireAuth, 
    public loadingCtrl: LoadingController ) {
    
    this.database = firebase.database();
    // this.emailId = 'abc@gmail.com';
    // this.password = 'aaaaaa';
    // this.signInDoc();
  }

  
  signInDoc(){
    let loading = this.loadingCtrl.create({
      content: 'Signing in...',
      dismissOnPageChange: true
    });

    loading.present();
    this.doctorAuthentication(loading);
  }

  
  doctorAuthentication(loading){
    this.afAuth.auth.signInWithEmailAndPassword(this.emailId, this.password)
      .then(data=>{
          var reference = this.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + data.uid);
          reference.once("value", (snapshot)=> {
              if(snapshot.val()){
                var key = Object.keys(snapshot.val())[0];
                var user = {
                  uid: data.uid,
                  emailId: this.emailId,
                  firstName: snapshot.val()[key]['firstName'],
                  lastName: snapshot.val()[key]['lastName'],
                  gender: snapshot.val()[key]['gender'],
                  dateOfBirth: snapshot.val()[key]['dateOfBirth']
                };
                console.log('Signed in with email '+ this.emailId);
                this.navCtrl.setRoot(DoctorMenuPage, user);
              }
              else{
                  console.log('Login error : No such doctor account!');
                  this.utilityProvider.showAlert('Error', 'There is no user record corresponding to this identifier. The user may have been deleted.');
                  loading.dismiss();
              }
           }, function (errorObject) {
             console.log("The read failed: " + errorObject.code);
             loading.dismiss();
         });
      })
      .catch(error=>{
        console.log('Login error : ', error.message);
        this.utilityProvider.showAlert('Error', error.message);
        loading.dismiss();
      })    
  }


  registerDoc(){
    this.navCtrl.push(DoctorRegisterPage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorHomePage');
  }

}
