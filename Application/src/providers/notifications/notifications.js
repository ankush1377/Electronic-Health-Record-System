var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NotificationListComponent } from '../../components/notification-list/notification-list';
import * as constants from '../../constants';
/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var NotificationsProvider = /** @class */ (function () {
    function NotificationsProvider() {
        console.log('Hello NotificationsProvider Provider');
    }
    NotificationsProvider.prototype.pollNotifications = function (database, notificationsData) {
        var thisRef = this;
        notificationsData.notificationsList = [];
        var notificationsPromise = new Promise(function (resolve, reject) {
            var notificationsRef = database.ref(constants.DB_NOTIFICATIONS + '/' + notificationsData['receiverUid']);
            notificationsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        notificationsPromise.then(function (notifications) {
            var keys = Object.keys(notifications);
            keys.forEach(function (listItem, index) {
                var doctorDataPromise = new Promise(function (resolve, reject) {
                    var doctorReference = database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + notifications[listItem].sender);
                    doctorReference.once('value', function (snapshot) {
                        if (snapshot.val()) {
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
                doctorDataPromise.then(function (notificationInfo) {
                    notificationsData.notificationsList.push(notificationInfo);
                }).catch(function (error) {
                    console.log(error);
                });
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
    NotificationsProvider.prototype.presentNotifications = function (event, popoverCtrl, notificationsData) {
        var popover = popoverCtrl.create(NotificationListComponent, notificationsData);
        popover.present({
            ev: event
        });
    };
    NotificationsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], NotificationsProvider);
    return NotificationsProvider;
}());
export { NotificationsProvider };
//# sourceMappingURL=notifications.js.map