import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController  } from 'ionic-angular';

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

  constructor( public navParams: NavParams) {
    console.log('Hello NotificationListComponent Component');
    console.log(navParams.data);
    this.notificationsList = navParams.data;
  }

}
