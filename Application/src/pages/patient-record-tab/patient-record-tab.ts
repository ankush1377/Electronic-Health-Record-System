import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, PopoverController, App  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { PatientHomePage } from '../patient-home/patient-home';

import { UtilityProvider } from '../../providers/utility/utility';
import { NotificationsProvider } from '../../providers/notifications/notifications';

import * as constants from '../../constants';
/**
 * Generated class for the PatientRecordTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-patient-record-tab',
  templateUrl: 'patient-record-tab.html'
})
export class PatientRecordTabPage {

  recordsData: any = [];
  notificationsData: any = {};
  storageRef: any;
  database: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
     public popoverCtrl: PopoverController, private notificationsProvider: NotificationsProvider,
     private utilityProvider: UtilityProvider, public appCtrl: App ) {

    this.storageRef = firebase.storage().ref(constants.STORAGE_DATA + '/' + navParams.get('uid'));
    this.notificationsData['receiverUid'] = navParams.get('uid');
    this.notificationsData['notificationsList'] = [];
    
    this.database = firebase.database();
    var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.navParams.get('uid'));
    notificationsRef.on('value', (snapshot)=>{
      notificationsProvider.pollNotifications(this.database, this.notificationsData);      
    });
    
    this.fetchRecords();
  }


  fetchRecords(){ 
    var thisRef = this; 
    
    let recordsPromise = new Promise((resolve, reject) => {
      var notificationsRef = thisRef.database.ref(constants.DB_RECORDS + '/' + this.navParams.get('uid'));
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    recordsPromise.then( (records)=>{
      if(records){
        var keys = Object.keys(records);
        keys.forEach(function(key, index){
          thisRef.storageRef.child(records[key]).getDownloadURL().then(function(url) {
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


  presentNotifications(event){
    this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
  }


  logoutUser(){
    this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientRecordTabPage');
  }

}
