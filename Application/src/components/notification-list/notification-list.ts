import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController  } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the NotificationListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListComponent {

  notificationsList: any = [];
  pendingNotificationsList: any = [];
  database: any;

  constructor( public navParams: NavParams, public alertCtrl: AlertController, private db: AngularFireDatabase ) {
    console.log('Hello NotificationListComponent Component');
    this.notificationsList = navParams.data.notificationsList;
    this.database = firebase.database();
  }

  notificationAction(notification){
    let confirm = this.alertCtrl.create({
      title: 'Approve Notification',
      message: 'Are you sure you want to allow this user to access your records?',
      buttons: [
        {
          text: 'Don\'t Allow',
          handler: () => {
            console.log('Don\'t Allow clicked');
            var update = {};
            update['/notifications/' + this.navParams.data.receiverUid + '/' + notification.dbKey + '/approval'] = 'refuse';
            this.database.ref().update(update);
            this.notificationsList.splice(this.notificationsList.indexOf(notification), 1);
          }
        },
        {
          text: 'Allow',
          handler: () => {
            console.log('Allow clicked');
            var update = {};
            update['/notifications/' + this.navParams.data.receiverUid + '/' + notification.dbKey + '/approval'] = 'approved';
            this.database.ref().update(update);
            this.notificationsList.splice(this.notificationsList.indexOf(notification), 1);
          }
        }
      ]
    });
    confirm.present();
  }

}