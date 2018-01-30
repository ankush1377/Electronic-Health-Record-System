import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

import { UtilityProvider } from '../../providers/utility/utility';

import * as constants from '../../constants';

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
  doctorInfo: any = {};
  patientUid: string = "";
  recordsData: any = [];
  database: any;
  storageRef: any;
  recordsAccessApproval: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private utilityProvider: UtilityProvider,
    public alertCtrl: AlertController, private db: AngularFireDatabase, public loadingCtrl: LoadingController,
    private iab: InAppBrowser) {
    this.doctorInfo = navParams.data;
    this.database = firebase.database();
    this.storageRef = firebase.storage().ref('/' + constants.STORAGE_DATA);
  }


  sendNotification(){
    var thisRef = this;
    this.recordsAccessApproval = false;
    
    if(this.patientUid != ""){
      var reference = this.database.ref(constants.DB_CREDENTIALS+'/'+constants.DB_CREDENTIALS_PATIENTS+'/'+this.patientUid);
      reference.on("value", (snapshot)=> {
        if(snapshot.val()){
          this.db.list(constants.DB_NOTIFICATIONS+'/'+this.patientUid).push({
            sender: this.doctorInfo.uid,
            approval: constants.NOTIFICATION_STATUS_PENDING
          }).then( ()=>{

            var dbKey;
            let notificationsRefPromise = new Promise((resolve, reject) => {
              var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.patientUid);
              notificationsRef.on('value', (snapshot)=>{
                var notificationUpdate = snapshot.val();
                if(notificationUpdate){
                  var keys = Object.keys(notificationUpdate);
                  keys.forEach(function(key, index){
                    if(notificationUpdate[key].sender === thisRef.doctorInfo.uid){
                      dbKey = key;
                      if(notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_APPROVED.toUpperCase() || 
                        notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_REJECTED.toUpperCase()){
                        resolve(notificationUpdate[key].approval);
                      }
                    }
                  });
                }
              })
            });

            notificationsRefPromise.then( (approval)=>{
              console.log(approval);
              var patientUid = this.patientUid;

              if(approval == constants.NOTIFICATION_STATUS_APPROVED){
                this.fetchPatientRecords(this.patientUid);
                this.recordsAccessApproval = true;
              }
              else if(approval == constants.NOTIFICATION_STATUS_REJECTED){
                this.utilityProvider.showAlert('Record Access', 'Sorry! The user did not approve this record access.');
                this.patientUid = '';
              }

              var update = {};
              update[constants.DB_NOTIFICATIONS + '/' + patientUid + '/' + dbKey] = null;
              this.database.ref().update(update);
            });

          });
        }
        else{
          this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
        }
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
    }
    else{
      this.utilityProvider.showAlert('Error','Please enter patient UID');
    }
  }


  fetchPatientRecords(uid){
    console.log('fetchPatientRecords');

    var thisRef = this; 
    let recordsPromise = new Promise((resolve, reject) => {
      var notificationsRef = thisRef.database.ref(constants.DB_RECORDS + '/' + uid);
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
    return this.iab.create(reportUrl);
  }


  uploadFile(event, patientUid){
    var thisRef = this;
    console.log(patientUid);
    let fileSelected = event.target.files[0];
    
    if(patientUid==null || !this.utilityProvider.checkUidValidity(patientUid, constants.DB_CREDENTIALS_PATIENTS)){
      this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
      event.target.files = null;
      return;
    }

    if(fileSelected){
      console.log(fileSelected);
      this.db.list(constants.DB_RECORDS + '/' + patientUid).push(fileSelected.name);
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
        if(thisRef.recordsAccessApproval)
          thisRef.fetchPatientRecords(patientUid);
      });
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMenuPage');
  }

}