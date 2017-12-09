import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';
import {NotificationListComponent} from '../../components/notification-list/notification-list';
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

  notificationsData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
     public popoverCtrl: PopoverController ) {

    this.notificationsData['receiverUid'] = navParams.get('uid');
    this.notificationsData['notificationsList'] = [];
    
    var database = firebase.database();
    var notificationsRef = database.ref('notifications/' + this.navParams.get('uid'));
    notificationsRef.on('value', (snapshot)=>{
      this.pollNotifications(database);      
    });
  }

  pollNotifications(database){
    var thisRef = this;
    thisRef.notificationsData.notificationsList = [];
    
    let notificationsPromise = new Promise((resolve, reject) => {
      var notificationsRef = database.ref('notifications/' + this.navParams.get('uid'));
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    notificationsPromise.then( (notifications)=>{
        var keys = Object.keys(notifications);
        keys.forEach(function(listItem, index){
          
          let doctorDataPromise = new Promise((resolve, reject) => {
            var doctorReference = database.ref('/credentials/doctors/' + notifications[listItem].sender);
            doctorReference.once('value', (snapshot)=> {
              if(snapshot.val()){
                var key = Object.keys(snapshot.val())[0];
                var notificationInfo = {
                  dbKey: listItem,
                  approval: notifications[listItem].approval,
                  senderUid: notifications[listItem].sender,
                  senderInfo: snapshot.val()[key]
                };
                resolve(notificationInfo);
              }
            });
          });

          doctorDataPromise.then( (notificationInfo)=>{ 
            thisRef.notificationsData.notificationsList.push(notificationInfo);
          }).catch((error)=>{
            console.log(error);
          });
        
        });
    }).catch((error)=>{
      console.log(error);
    });
  
  }

  presentNotifications(event){
    let popover = this.popoverCtrl.create(NotificationListComponent, this.notificationsData);
    popover.present({
      ev: event
    }); 
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
