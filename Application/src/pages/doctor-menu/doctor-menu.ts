import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
  database: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private db: AngularFireDatabase, public loadingCtrl: LoadingController ) {
  	this.doctorName = this.navParams.get('firstName') + ' ' + this.navParams.get('lastName');
    this.uid = this.navParams.get('uid');
    this.emailId = this.navParams.get('emailId');
    this.firstName = this.navParams.get('firstName');
    this.lastName = this.navParams.get('lastName');
    this.gender = this.navParams.get('gender');
    this.dateOfBirth = this.navParams.get('dateOfBirth');
    this.database = firebase.database();
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
    var reference = this.database.ref('/credentials/patients/' + uid);
    reference.on("value", (snapshot)=> {
      if(snapshot.val()){
        this.db.list('/notifications/' + uid).push({
          sender: this.uid,
          approval: 'pending'
        }).then( ()=>{
          // let loading = this.loadingCtrl.create({
          //   content: 'Waiting for approval...',
          //   duration: 20000
          // });
          // loading.present();
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