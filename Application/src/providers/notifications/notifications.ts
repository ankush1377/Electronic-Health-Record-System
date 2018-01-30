import { Injectable } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import {NotificationListComponent} from '../../components/notification-list/notification-list';

import * as constants from '../../constants';
/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {

  constructor() {
    console.log('Hello NotificationsProvider Provider');
  }

  
  pollNotifications(database, notificationsData){
    var thisRef = this;
    notificationsData.notificationsList = [];
    
    let notificationsPromise = new Promise((resolve, reject) => {
      var notificationsRef = database.ref(constants.DB_NOTIFICATIONS + '/' + notificationsData['receiverUid']);
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    notificationsPromise.then( (notifications)=>{
        var keys = Object.keys(notifications);
        keys.forEach(function(listItem, index){
          
          let doctorDataPromise = new Promise((resolve, reject) => {
            var doctorReference = database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + notifications[listItem].sender);
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
            notificationsData.notificationsList.push(notificationInfo);
          }).catch((error)=>{
            console.log(error);
          });
        
        });
    }).catch((error)=>{
      console.log(error);
    });
  
  }

  presentNotifications(event, popoverCtrl: PopoverController , notificationsData){
    let popover = popoverCtrl.create(NotificationListComponent, notificationsData);
    popover.present({
      ev: event
    }); 
  }


}
