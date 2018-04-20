import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';

import { UtilityProvider } from '../../providers/utility/utility';
import { NotificationsProvider } from '../../providers/notifications/notifications';

import * as constants from '../../constants';


/**
 * Generated class for the PatientAppointmentsTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-patient-appointments-tab',
  templateUrl: 'patient-appointments-tab.html',
})
export class PatientAppointmentsTabPage {

  userData: any = {};
  notificationsData: any = {};
  notifications: number;
  database: any;
  appointmentsData: any = [];

  constructor(private afAuth: AngularFireAuth, private notificationsProvider: NotificationsProvider,
    private utilityProvider: UtilityProvider, public appCtrl: App, public navCtrl: NavController, 
    public navParams: NavParams, public popoverCtrl: PopoverController) {

    this.notificationsData['receiverUid'] = this.userData.uid;
    this.notificationsData['notificationsList'] = [];

    this.database = firebase.database();
    var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.userData.uid);
    notificationsRef.on('value', (snapshot)=>{
      notificationsProvider.pollNotifications(this.database, this.notificationsData);      
    });

  }





  presentNotifications(event){
    this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
  }


  logoutUser(){
    this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientAppointmentsTabPage');
  }

}
