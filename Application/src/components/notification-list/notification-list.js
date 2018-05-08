var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the NotificationListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var NotificationListComponent = /** @class */ (function () {
    function NotificationListComponent(navParams, alertCtrl, db) {
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.db = db;
        this.notificationsList = [];
        console.log('Hello NotificationListComponent Component');
        this.database = firebase.database();
        var notificationsList = [];
        var thisRef = this;
        notificationsList = navParams.data.notificationsList;
        notificationsList.forEach(function (notification, index) {
            if (notification.approval.toUpperCase() === 'pending'.toUpperCase()) {
                thisRef.notificationsList.push(notification);
            }
        });
    }
    NotificationListComponent.prototype.notificationAction = function (notification) {
        var _this = this;
        var update = {};
        var confirm = this.alertCtrl.create({
            title: 'Approve Notification',
            message: 'Are you sure you want to allow this user to access your records?',
            buttons: [
                {
                    text: 'Don\'t Allow',
                    handler: function () {
                        console.log('Don\'t Allow clicked');
                        update['/notifications/' + _this.navParams.data.receiverUid + '/' + notification.dbKey + '/approval'] = 'refuse';
                        _this.database.ref().update(update);
                        _this.notificationsList.splice(_this.notificationsList.indexOf(notification), 1);
                    }
                },
                {
                    text: 'Allow',
                    handler: function () {
                        console.log('Allow clicked');
                        update['/notifications/' + _this.navParams.data.receiverUid + '/' + notification.dbKey + '/approval'] = 'approved';
                        _this.database.ref().update(update);
                        _this.notificationsList.splice(_this.notificationsList.indexOf(notification), 1);
                    }
                }
            ]
        });
        confirm.present();
    };
    NotificationListComponent = __decorate([
        Component({
            selector: 'notification-list',
            templateUrl: 'notification-list.html'
        }),
        __metadata("design:paramtypes", [NavParams, AlertController, AngularFireDatabase])
    ], NotificationListComponent);
    return NotificationListComponent;
}());
export { NotificationListComponent };
//# sourceMappingURL=notification-list.js.map