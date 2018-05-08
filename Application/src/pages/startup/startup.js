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
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { PatientHomePage } from '../patient-home/patient-home';
import { PatientSetupPage } from '../patient-setup/patient-setup';
import { PatientTabsPage } from '../patient-tabs/patient-tabs';
import { DoctorHomePage } from '../doctor-home/doctor-home';
import { UtilityProvider } from '../../providers/utility/utility';
/**
 * Generated class for the StartupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var StartupPage = /** @class */ (function () {
    function StartupPage(alertCtrl, utilityProvider, afAuth, navCtrl, navParams, storage, plt) {
        var _this = this;
        this.alertCtrl = alertCtrl;
        this.utilityProvider = utilityProvider;
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.plt = plt;
        if (plt.is('core') || plt.is('ipad') || plt.is('phablet') || plt.is('tablet')) {
            navCtrl.setRoot(DoctorHomePage);
            return;
        }
        setTimeout(function () {
            storage.get('emailId').then(function (val) {
                _this.email = val;
                storage.get('password').then(function (val) { _this.password = val; });
                afAuth.auth.signInWithEmailAndPassword(_this.email, _this.password)
                    .then(function (data) {
                    console.log('Signed in with email ' + _this.email);
                })
                    .catch(function (error) {
                    console.log('Login error : ', error.message);
                    _this.utilityProvider.showAlert('Error', error.message);
                });
                storage.get('firstName').then(function (val) {
                    navCtrl.setRoot(PatientTabsPage);
                })
                    .catch(function (error) {
                    navCtrl.setRoot(PatientSetupPage);
                });
            })
                .catch(function (error) {
                navCtrl.setRoot(PatientHomePage);
            });
        }, 1500);
    }
    StartupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad StartupPage');
    };
    StartupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-startup',
            templateUrl: 'startup.html',
        }),
        __metadata("design:paramtypes", [AlertController, UtilityProvider,
            AngularFireAuth,
            NavController,
            NavParams,
            Storage, Platform])
    ], StartupPage);
    return StartupPage;
}());
export { StartupPage };
//# sourceMappingURL=startup.js.map