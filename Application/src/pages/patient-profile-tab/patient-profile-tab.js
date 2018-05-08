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
import { NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { PatientHomePage } from '../patient-home/patient-home';
import { UtilityProvider } from '../../providers/utility/utility';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import * as constants from '../../constants';
/**
 * Generated class for the PatientProfileTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientProfileTabPage = /** @class */ (function () {
    function PatientProfileTabPage(afAuth, notificationsProvider, utilityProvider, appCtrl, navCtrl, navParams, popoverCtrl) {
        var _this = this;
        this.afAuth = afAuth;
        this.notificationsProvider = notificationsProvider;
        this.utilityProvider = utilityProvider;
        this.appCtrl = appCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.userData = {};
        this.notificationsData = {};
        this.userData = navParams.data;
        this.notificationsData['receiverUid'] = this.userData.uid;
        this.notificationsData['notificationsList'] = [];
        this.database = firebase.database();
        var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.userData.uid);
        notificationsRef.on('value', function (snapshot) {
            notificationsProvider.pollNotifications(_this.database, _this.notificationsData);
        });
    }
    PatientProfileTabPage.prototype.presentNotifications = function (event) {
        this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
    };
    PatientProfileTabPage.prototype.logoutUser = function () {
        this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
    };
    PatientProfileTabPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientProfileTabPage');
    };
    PatientProfileTabPage = __decorate([
        Component({
            selector: 'page-patient-profile-tab',
            templateUrl: 'patient-profile-tab.html',
        }),
        __metadata("design:paramtypes", [AngularFireAuth, NotificationsProvider,
            UtilityProvider, App, NavController,
            NavParams, PopoverController])
    ], PatientProfileTabPage);
    return PatientProfileTabPage;
}());
export { PatientProfileTabPage };
//# sourceMappingURL=patient-profile-tab.js.map