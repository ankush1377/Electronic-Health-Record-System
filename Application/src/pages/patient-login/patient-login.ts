import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { PatientTabsPage } from '../patient-tabs/patient-tabs';

import { UtilityProvider } from '../../providers/utility/utility';

import * as constants from '../../constants';
/**
 * Generated class for the PatientLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patient-login',
  templateUrl: 'patient-login.html',
})
export class PatientLoginPage {

  emailId: string = '';
  password: string = '';
  database: any;

  constructor(public alertCtrl: AlertController, public utilityProvider: UtilityProvider, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, public loadingCtrl: LoadingController ) {

    this.database = firebase.database();
    // this.emailId = 'a@gmail.com';
    // this.password = 'aaaaaa';
    // this.signInUser();
  }


  signInUser(){
      let loading = this.loadingCtrl.create({
        content: 'Signing in...',
        dismissOnPageChange: true
      });

      loading.present();
      this.userAuthentication(loading);
  }


  userAuthentication(loading){
    this.afAuth.auth.signInWithEmailAndPassword(this.emailId, this.password)
      .then(data=>{
          var reference = this.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + data.uid);
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
                this.navCtrl.setRoot(PatientTabsPage, user);
              }
              else{
                  console.log('Login error : No such patient account!');
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientLoginPage');
  }

}
