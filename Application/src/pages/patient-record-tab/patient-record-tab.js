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
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
var PatientRecordTabPage = /** @class */ (function () {
    function PatientRecordTabPage(navCtrl, navParams, afAuth, popoverCtrl, notificationsProvider, utilityProvider, appCtrl, iab) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afAuth = afAuth;
        this.popoverCtrl = popoverCtrl;
        this.notificationsProvider = notificationsProvider;
        this.utilityProvider = utilityProvider;
        this.appCtrl = appCtrl;
        this.iab = iab;
        this.recordsData = [];
        this.notificationsData = {};
        this.storageRef = firebase.storage().ref(constants.STORAGE_DATA + '/' + navParams.get('uid'));
        this.notificationsData['receiverUid'] = navParams.get('uid');
        this.notificationsData['notificationsList'] = [];
        this.database = firebase.database();
        var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.navParams.get('uid'));
        notificationsRef.on('value', function (snapshot) {
            notificationsProvider.pollNotifications(_this.database, _this.notificationsData);
        });
        var recordsRef = this.database.ref(constants.DB_RECORDS + '/' + this.navParams.get('uid'));
        recordsRef.on('value', function (snapshot) {
            _this.fetchRecords();
        });
    }
    PatientRecordTabPage.prototype.fetchRecords = function () {
        var _this = this;
        var thisRef = this;
        var recordsPromise = new Promise(function (resolve, reject) {
            var notificationsRef = thisRef.database.ref(constants.DB_RECORDS + '/' + _this.navParams.get('uid'));
            notificationsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        recordsPromise.then(function (records) {
            thisRef.recordsData = [];
            if (records) {
                var keys = Object.keys(records);
                keys.forEach(function (key) {
                    thisRef.storageRef.child(records[key].fileName).getDownloadURL().then(function (url) {
                        thisRef.recordsData.push({
                            name: records[key].fileName,
                            url: url
                        });
                    });
                });
            }
        });
    };
    PatientRecordTabPage.prototype.fetchReport = function (reportUrl) {
        return this.iab.create(reportUrl);
    };
    PatientRecordTabPage.prototype.presentNotifications = function (event) {
        this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
    };
    PatientRecordTabPage.prototype.logoutUser = function () {
        this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
    };
    PatientRecordTabPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientRecordTabPage');
    };
    PatientRecordTabPage = __decorate([
        Component({
            selector: 'page-patient-record-tab',
            templateUrl: 'patient-record-tab.html'
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireAuth,
            PopoverController, NotificationsProvider,
            UtilityProvider, App, InAppBrowser])
    ], PatientRecordTabPage);
    return PatientRecordTabPage;
}());
export { PatientRecordTabPage };
//# sourceMappingURL=patient-record-tab.js.map