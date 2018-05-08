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
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { PatientSetupPage } from '../patient-setup/patient-setup';
import { UtilityProvider } from '../../providers/utility/utility';
/**
 * Generated class for the PatientRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientRegisterPage = /** @class */ (function () {
    function PatientRegisterPage(storage, utilityProvider, alertCtrl, loadingCtrl, afAuth, navCtrl, navParams) {
        this.storage = storage;
        this.utilityProvider = utilityProvider;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.emailId = "";
        this.password = "";
        this.cpassword = "";
    }
    PatientRegisterPage.prototype.registerUser = function () {
        var _this = this;
        if (this.password == this.cpassword) {
            var loading_1 = this.loadingCtrl.create({
                content: 'Creating account...',
                dismissOnPageChange: true
            });
            loading_1.present();
            this.afAuth.auth.createUserWithEmailAndPassword(this.emailId, this.password)
                .then(function (data) {
                console.log('Registered with email ' + _this.emailId);
                _this.storage.set('emailId', _this.emailId);
                _this.storage.set('password', _this.password);
                loading_1.dismiss();
                _this.navCtrl.setRoot(PatientSetupPage);
            })
                .catch(function (error) {
                console.log('Registration error : ', error.message);
                loading_1.dismiss();
                _this.utilityProvider.showAlert('Error', error.message);
            });
        }
        else {
            this.utilityProvider.showAlert('Error', 'Both passwords do not match!');
        }
    };
    PatientRegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientRegisterPage');
    };
    PatientRegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-patient-register',
            templateUrl: 'patient-register.html',
        }),
        __metadata("design:paramtypes", [Storage, UtilityProvider,
            AlertController, LoadingController,
            AngularFireAuth,
            NavController,
            NavParams])
    ], PatientRegisterPage);
    return PatientRegisterPage;
}());
export { PatientRegisterPage };
//# sourceMappingURL=patient-register.js.map