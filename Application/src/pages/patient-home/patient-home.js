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
import { IonicPage, NavController } from 'ionic-angular';
import { PatientLoginPage } from '../patient-login/patient-login';
import { PatientRegisterPage } from '../patient-register/patient-register';
/**
 * Generated class for the PatientHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientHomePage = /** @class */ (function () {
    function PatientHomePage(navCtrl) {
        this.navCtrl = navCtrl;
        this.signIn();
    }
    PatientHomePage.prototype.signIn = function () {
        console.log('Clicked sign in');
        this.navCtrl.push(PatientLoginPage);
    };
    PatientHomePage.prototype.register = function () {
        console.log('Clicked register');
        this.navCtrl.push(PatientRegisterPage);
    };
    PatientHomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientHomePage');
    };
    PatientHomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-patient-home',
            templateUrl: 'patient-home.html',
        }),
        __metadata("design:paramtypes", [NavController])
    ], PatientHomePage);
    return PatientHomePage;
}());
export { PatientHomePage };
//# sourceMappingURL=patient-home.js.map