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
  recordsData: any = [];
  database: any;
  storageRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private db: AngularFireDatabase, public loadingCtrl: LoadingController ) {
    this.uid = this.navParams.get('uid');
    this.emailId = this.navParams.get('emailId');
    this.firstName = this.navParams.get('firstName');
    this.lastName = this.navParams.get('lastName');
    this.gender = this.navParams.get('gender');
    this.dateOfBirth = this.navParams.get('dateOfBirth');
    this.doctorName = this.firstName + ' ' + this.lastName;
    this.database = firebase.database();
    this.storageRef = firebase.storage().ref('/data');
  }

  sendNotification(){
    var thisRef = this;
    if(this.patientUid != ""){
      var reference = this.database.ref('/credentials/patients/' + this.patientUid);
      reference.on("value", (snapshot)=> {
        if(snapshot.val()){
          this.db.list('/notifications/' + this.patientUid).push({
            sender: this.uid,
            approval: 'pending'
          }).then( ()=>{

            var dbKey;
            let notificationsRefPromise = new Promise((resolve, reject) => {
              var notificationsRef = this.database.ref('notifications/' + this.patientUid);
              notificationsRef.on('value', (snapshot)=>{
                var notificationUpdate = snapshot.val();
                if(notificationUpdate){
                  var keys = Object.keys(notificationUpdate);
                  keys.forEach(function(key, index){
                    if(notificationUpdate[key].sender.toUpperCase() === thisRef.uid.toUpperCase()){
                      dbKey = key;
                      if(notificationUpdate[key].approval.toUpperCase() === 'approved'.toUpperCase() || 
                        notificationUpdate[key].approval.toUpperCase() === 'refuse'.toUpperCase()){
                        resolve(notificationUpdate[key].approval);
                      }
                    }
                  });
                }
              })
            });

            notificationsRefPromise.then( (approval)=>{
              if(approval === 'approved'){
                console.log(approval);
                this.fetchPatientRecords(this.patientUid);
              }
              else{
                this.showAlert('Record Access', 'Sorry! The user did not approve this record access.');
                this.patientUid = '';
              }
              var update = {};
              update['/notifications/' + this.patientUid + '/' + dbKey] = null;
              this.database.ref().update(update);
            });

          });
        }
        else{
          this.showAlert('Error', 'Enter a valid patient UID');
        }
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
    }
    else{
      this.showAlert('Error','Please enter patient UID');
    }
  }

  fetchPatientRecords(uid){
    var thisRef = this; 
    let recordsPromise = new Promise((resolve, reject) => {
      var notificationsRef = thisRef.database.ref('records/' + uid);
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    recordsPromise.then( (records)=>{
      thisRef.recordsData = [];
      console.log(records);
      if(records){
        var keys = Object.keys(records);
        keys.forEach(function(key, index){
          thisRef.storageRef.child(uid + '/' + records[key]).getDownloadURL().then(function(url) {
            thisRef.recordsData.push({
              name: records[key],
              url: url
            });
          })
        })
      }
    });
  }

  fetchReport(reportUrl){
    console.log(reportUrl);
  }

  uploadFile(event, patientUid){
    var thisRef = this;
    console.log(patientUid);
    let fileSelected = event.target.files[0];
    if(fileSelected){
      console.log(fileSelected);
      this.db.list('/records/' + patientUid).push(fileSelected.name);
      var uploadTask = this.storageRef.child(patientUid + '/' + fileSelected.name).put(fileSelected);
      uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
        thisRef.fetchPatientRecords(patientUid);
      });
    }
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