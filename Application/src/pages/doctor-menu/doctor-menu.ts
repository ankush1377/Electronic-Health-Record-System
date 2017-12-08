import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the DoctorMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctor-menu',
  templateUrl: 'doctor-menu.html',
})
export class DoctorMenuPage {

	selectedSegment: string = 'profile';
	doctorName: string = "";
  uid : string = "";
  emailId : string = "";
  firstName : string = "";
  lastName : string = "";
  gender : string = "";
  dateOfBirth : string = "";
  patientUid: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private db: AngularFireDatabase ) {
  	this.doctorName = this.navParams.get('firstName') + ' ' + this.navParams.get('lastName');
    this.uid = this.navParams.get('uid');
    this.emailId = this.navParams.get('emailId');
    this.firstName = this.navParams.get('firstName');
    this.lastName = this.navParams.get('lastName');
    this.gender = this.navParams.get('gender');
    this.dateOfBirth = this.navParams.get('dateOfBirth');
  }

  fetchPatientRecords(){
    if(this.patientUid != ""){
      this.sendNotification(this.patientUid);  
    }
    else{
      this.showAlert('Error','Please enter patient UID');
    }
  }

  sendNotification(uid){
    var database = firebase.database();
    var reference = database.ref('/credentials/patients/' + uid);
    reference.on("value", (snapshot)=> {
      if(snapshot.val()){
        this.db.list('/notifications/' + uid).push({
          sender: this.uid,
          approval: 'pending'
        }).then( ()=>{
          //success
        });
      }
      else{
        this.showAlert('Error', 'Enter a valid patient UID');
      }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
  }

  getNotificationApproval(){

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
    console.log('ionViewDidLoad DoctorMenuPage');
  }

}