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
import { NavParams } from 'ionic-angular';
import { PatientProfileTabPage } from '../patient-profile-tab/patient-profile-tab';
import { PatientRecordTabPage } from '../patient-record-tab/patient-record-tab';
import { PatientDiseasePredictorTabPage } from '../patient-disease-predictor-tab/patient-disease-predictor-tab';
import { PatientAppointmentsTabPage } from '../patient-appointments-tab/patient-appointments-tab';
import { PatientPrescriptionsTabPage } from '../patient-prescriptions-tab/patient-prescriptions-tab';
/**
 * Generated class for the PatientTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientTabsPage = /** @class */ (function () {
    function PatientTabsPage(navParams) {
        this.navParams = navParams;
        this.tab1Root = PatientPrescriptionsTabPage;
        this.tab2Root = PatientRecordTabPage;
        this.tab3Root = PatientProfileTabPage;
        this.tab4Root = PatientDiseasePredictorTabPage;
        this.tab5Root = PatientAppointmentsTabPage;
        this.userData = navParams.data;
    }
    PatientTabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientTabsPage');
    };
    PatientTabsPage = __decorate([
        Component({
            templateUrl: 'patient-tabs.html'
        }),
        __metadata("design:paramtypes", [NavParams])
    ], PatientTabsPage);
    return PatientTabsPage;
}());
export { PatientTabsPage };
//# sourceMappingURL=patient-tabs.js.map