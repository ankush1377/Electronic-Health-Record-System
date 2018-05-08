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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';
import { UtilityProvider } from '../../providers/utility/utility';
import * as constants from '../../constants';
/**
 * Generated class for the PatientSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientSetupPage = /** @class */ (function () {
    function PatientSetupPage(alertCtrl, utilityProvider, db, afAuth, navCtrl, navParams) {
        this.alertCtrl = alertCtrl;
        this.utilityProvider = utilityProvider;
        this.db = db;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.patientInfo = {};
        this.uid = '';
        this.uid = afAuth.auth.currentUser.uid;
        ;
    }
    PatientSetupPage.prototype.saveUserCredentials = function () {
        if (!this.validateName(this.patientInfo.firstName)) {
            this.utilityProvider.showAlert('Error', 'Please enter a valid first name');
            return;
        }
        if (!this.validateName(this.patientInfo.lastName)) {
            this.utilityProvider.showAlert('Error', 'Please enter a valid last name');
            return;
        }
        if (this.patientInfo.gender == "") {
            this.utilityProvider.showAlert('Error', 'Please select gender');
            return;
        }
        if (this.patientInfo.dateOfBirth == "") {
            this.utilityProvider.showAlert('Error', 'Please select date of birth');
            return;
        }
        console.log('Saving user credentials!');
        this.patientInfo.emailId = this.afAuth.auth.currentUser.email;
        this.db.list(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + this.uid).push(this.patientInfo);
        this.patientInfo['uid'] = this.uid;
        // this.storage.set('firstName', this.firstName);
        // this.storage.set('lastName', this.lastName);
        // this.storage.set('gender', this.gender);
        // this.storage.set('dateOfBirth', this.dateOfBirth);
        this.navCtrl.setRoot(PatientTabsPage, this.patientInfo);
    };
    PatientSetupPage.prototype.validateName = function (name) {
        if (name.length > 0 && /^[a-zA-Z]+$/.test(name))
            return true;
        return false;
    };
    PatientSetupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientSetupPage');
    };
    PatientSetupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-patient-setup',
            templateUrl: 'patient-setup.html',
        }),
        __metadata("design:paramtypes", [AlertController, UtilityProvider,
            AngularFireDatabase,
            AngularFireAuth,
            NavController,
            NavParams])
    ], PatientSetupPage);
    return PatientSetupPage;
}());
export { PatientSetupPage };
//# sourceMappingURL=patient-setup.js.map