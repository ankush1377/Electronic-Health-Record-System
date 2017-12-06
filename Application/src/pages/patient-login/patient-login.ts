import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { PatientTabsPage } from '../patient-tabs/patient-tabs';

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

	@ViewChild('emailId') emailId;
	@ViewChild('password') password;

  constructor(public alertCtrl: AlertController, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, public loadingCtrl: LoadingController ) {
  }

  signInUser(){
      let loading = this.loadingCtrl.create({
        content: 'Signing in...',
        dismissOnPageChange: true
      });

      loading.present();
      this.userAuthentication();
  }

  userAuthentication(){
    this.afAuth.auth.signInWithEmailAndPassword(this.emailId.value, this.password.value)
      .then(data=>{
          var database = firebase.database();
          var reference = database.ref('/credentials/patients/' + data.uid);
          reference.on("value", (snapshot)=> {
              if(snapshot.val()){
                var key = Object.keys(snapshot.val())[0];
                var user = {
                  emailId: this.emailId.value,
                  firstName: snapshot.val()[key]['firstName'],
                  lastName: snapshot.val()[key]['lastName'],
                  gender: snapshot.val()[key]['gender'],
                  dateOfBirth: snapshot.val()[key]['dateOfBirth']
                };
                console.log('Signed in with email '+ this.emailId.value);
                this.navCtrl.setRoot(PatientTabsPage, user);
              }
              else{
                  console.log('Login error : No such patient account!');
                  this.showAlert('Error', 'There is no user record corresponding to this identifier. The user may have been deleted.');
              }
           }, function (errorObject) {
             console.log("The read failed: " + errorObject.code);
         });

      })
      .catch(error=>{
        console.log('Login error : ', error.message);
        this.showAlert('Error', error.message);
      })    
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientLoginPage');
  }

}
