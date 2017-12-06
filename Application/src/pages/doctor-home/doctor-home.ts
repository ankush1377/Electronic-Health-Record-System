import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { DoctorRegisterPage } from '../doctor-register/doctor-register';
import { DoctorMenuPage } from '../doctor-menu/doctor-menu';
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

	@ViewChild('emailId') emailId;
	@ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  	public alertCtrl: AlertController, private afAuth: AngularFireAuth, 
    public loadingCtrl: LoadingController ) {
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
    this.afAuth.auth.signInWithEmailAndPassword(this.emailId.value, this.password.value)
      .then(data=>{
          var database = firebase.database();
          var reference = database.ref('/credentials/doctors/' + data.uid);
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
                this.navCtrl.setRoot(DoctorMenuPage, user);
              }
              else{
                  console.log('Login error : No such doctor account!');
                  this.showAlert('Error', 'There is no user record corresponding to this identifier. The user may have been deleted.');
                  loading.dismiss();
              }
           }, function (errorObject) {
             console.log("The read failed: " + errorObject.code);
             loading.dismiss();
         });
      })
      .catch(error=>{
        console.log('Login error : ', error.message);
        this.showAlert('Error', error.message);
        loading.dismiss();
      })    
  }

  registerDoc(){
    this.navCtrl.push(DoctorRegisterPage);
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
    console.log('ionViewDidLoad DoctorHomePage');
  }

}
