import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';

/**
 * Generated class for the PatientRecordTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-patient-record-tab',
  templateUrl: 'patient-record-tab.html',
})
export class PatientRecordTabPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth) {
    var storageRef = firebase.storage().ref();
    var dataRef = storageRef.child('/data/' + afAuth.auth.currentUser.uid + '/2017-11-16_Hospital-Name_ECG_Doctor-Name.pdf');
    // console.log(storageRef);
    // console.log(dataRef);

 //    dataRef.getDownloadURL().then(function(url) {
	//   // `url` is the download URL for 'images/stars.jpg'

	//   // This can be downloaded directly:
	//   var xhr = new XMLHttpRequest();
	//   xhr.responseType = 'blob';
	//   xhr.onload = function(event) {
	//     var blob = xhr.response;
	//   };
	//   xhr.open('GET', url);
	//   xhr.send();

	//   // Or inserted into an <img> element:
	//   // var img = document.getElementById('myimg');
	//   // img.src = url;
	// }).catch(function(error) {
	//   // Handle any errors
	// });
    // var storageRef = firebase.storage().ref('/');
    // var path = afAuth.auth.currentUser.uid + '/' + 
    // new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate() + 
    // '_HospitalName' + '/fileName.pdf';
    // console.log(path);   
    // var fileRef = storageRef.child(path);
  }


  logoutUser(){
    console.log('Logging out');
    this.afAuth.auth.signOut;
    this.navCtrl.setRoot(PatientHomePage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientRecordTabPage');
  }

}
