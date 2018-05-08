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
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';
import { UtilityProvider } from '../../providers/utility/utility';
import * as constants from '../../constants';
/**
 * Generated class for the PatientLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientLoginPage = /** @class */ (function () {
    function PatientLoginPage(alertCtrl, utilityProvider, afAuth, navCtrl, loadingCtrl) {
        this.alertCtrl = alertCtrl;
        this.utilityProvider = utilityProvider;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.emailId = 'p@gmail.com';
        this.password = 'aaaaaa';
        this.database = firebase.database();
        // this.emailId = 'a@gmail.com';
        // this.password = 'aaaaaa';
        this.signInUser();
    }
    PatientLoginPage.prototype.signInUser = function () {
        var loading = this.loadingCtrl.create({
            content: 'Signing in...',
            dismissOnPageChange: true
        });
        loading.present();
        this.userAuthentication(loading);
    };
    PatientLoginPage.prototype.userAuthentication = function (loading) {
        var _this = this;
        this.afAuth.auth.signInWithEmailAndPassword(this.emailId, this.password)
            .then(function (data) {
            var reference = _this.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + data.uid);
            reference.once("value", function (snapshot) {
                if (snapshot.val()) {
                    var key = Object.keys(snapshot.val())[0];
                    var user = {
                        uid: data.uid,
                        emailId: _this.emailId,
                        firstName: snapshot.val()[key]['firstName'],
                        lastName: snapshot.val()[key]['lastName'],
                        gender: snapshot.val()[key]['gender'],
                        dateOfBirth: snapshot.val()[key]['dateOfBirth']
                    };
                    console.log('Signed in with email ' + _this.emailId);
                    _this.navCtrl.setRoot(PatientTabsPage, user);
                }
                else {
                    console.log('Login error : No such patient account!');
                    _this.utilityProvider.showAlert('Error', 'There is no user record corresponding to this identifier. The user may have been deleted.');
                    loading.dismiss();
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                loading.dismiss();
            });
        })
            .catch(function (error) {
            console.log('Login error : ', error.message);
            _this.utilityProvider.showAlert('Error', error.message);
            loading.dismiss();
        });
    };
    PatientLoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientLoginPage');
    };
    PatientLoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-patient-login',
            templateUrl: 'patient-login.html',
        }),
        __metadata("design:paramtypes", [AlertController, UtilityProvider,
            AngularFireAuth,
            NavController, LoadingController])
    ], PatientLoginPage);
    return PatientLoginPage;
}());
export { PatientLoginPage };
//# sourceMappingURL=patient-login.js.map