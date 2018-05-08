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
import { Storage } from '@ionic/storage';
import { DoctorMenuPage } from '../doctor-menu/doctor-menu';
import { RestProvider } from '../../providers/rest/rest';
import { UtilityProvider } from '../../providers/utility/utility';
import * as constants from '../../constants';
/**
 * Generated class for the DoctorRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DoctorRegisterPage = /** @class */ (function () {
    function DoctorRegisterPage(navCtrl, navParams, utilityProvider, alertCtrl, afAuth, storage, db, restProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.utilityProvider = utilityProvider;
        this.alertCtrl = alertCtrl;
        this.afAuth = afAuth;
        this.storage = storage;
        this.db = db;
        this.restProvider = restProvider;
        this.doctorInfo = { department: 'initial' };
        this.password = "";
        this.cPassword = "";
        this.hospitalList = [];
        this.stateList = [{ "code": "AN", "name": "Andaman and Nicobar Islands" }, { "code": "AP", "name": "Andhra Pradesh" }, { "code": "AR", "name": "Arunachal Pradesh" }, { "code": "AS", "name": "Assam" }, { "code": "BR", "name": "Bihar" }, { "code": "CG", "name": "Chandigarh" }, { "code": "CH", "name": "Chhattisgarh" }, { "code": "DH", "name": "Dadra and Nagar Haveli" }, { "code": "DD", "name": "Daman and Diu" }, { "code": "DL", "name": "Delhi" }, { "code": "GA", "name": "Goa" }, { "code": "GJ", "name": "Gujarat" }, { "code": "HR", "name": "Haryana" }, { "code": "HP", "name": "Himachal Pradesh" }, { "code": "JK", "name": "Jammu and Kashmir" }, { "code": "JH", "name": "Jharkhand" }, { "code": "KA", "name": "Karnataka" }, { "code": "KL", "name": "Kerala" }, { "code": "LD", "name": "Lakshadweep" }, { "code": "MP", "name": "Madhya Pradesh" }, { "code": "MH", "name": "Maharashtra" }, { "code": "MN", "name": "Manipur" }, { "code": "ML", "name": "Meghalaya" }, { "code": "MZ", "name": "Mizoram" }, { "code": "NL", "name": "Nagaland" }, { "code": "OR", "name": "Odisha" }, { "code": "PY", "name": "Puducherry" }, { "code": "PB", "name": "Punjab" }, { "code": "RJ", "name": "Rajasthan" }, { "code": "SK", "name": "Sikkim" }, { "code": "TN", "name": "Tamil Nadu" }, { "code": "TS", "name": "Telangana" }, { "code": "TR", "name": "Tripura" }, { "code": "UP", "name": "Uttar Pradesh" }, { "code": "UK", "name": "Uttarakhand" }, { "code": "WB", "name": "West Bengal" }];
        this.departmentList = [];
        this.selectedState = 'initial';
        this.selectedHospital = 'initial';
        this.hospitalList.hospitals = [];
        this.hospitalList.dispensaries = [];
    }
    DoctorRegisterPage.prototype.setHospitalList = function () {
        var thisRef = this;
        thisRef.restProvider.getHospitalData(this.selectedState).then(function (data) {
            console.log(data);
            thisRef.hospitalList.hospitals = data['records'];
        });
        thisRef.restProvider.getDispensaryData(this.selectedState).then(function (data) {
            console.log(data);
            thisRef.hospitalList.dispensaries = data['records'];
        });
        thisRef.selectedHospital = 'initial';
    };
    DoctorRegisterPage.prototype.registerDoctor = function () {
        var _this = this;
        if (this.doctorInfo.emailId == "") {
            this.utilityProvider.showAlert('Error', 'Please enter email id');
            return;
        }
        if (this.password == "") {
            this.utilityProvider.showAlert('Error', 'Please enter password');
            return;
        }
        if (this.cPassword == "") {
            this.utilityProvider.showAlert('Error', 'Please confirm your password');
            return;
        }
        if (this.doctorInfo.firstName == "") {
            this.utilityProvider.showAlert('Error', 'Please enter first name');
            return;
        }
        if (this.doctorInfo.lastName == "") {
            this.utilityProvider.showAlert('Error', 'Please enter last name');
            return;
        }
        if (this.doctorInfo.gender == "") {
            this.utilityProvider.showAlert('Error', 'Please enter last name');
            return;
        }
        if (this.doctorInfo.dateOfBirth == "") {
            this.utilityProvider.showAlert('Error', 'Please enter last name');
            return;
        }
        if (this.selectedState == "") {
            this.utilityProvider.showAlert('Error', 'Please enter last name');
            return;
        }
        if (this.selectedHospital == "") {
            this.utilityProvider.showAlert('Error', 'Please enter last name');
            return;
        }
        if (this.password == this.cPassword) {
            // if(this.validateUPRN(this.doctorInfo.uprn)){
            this.afAuth.auth.createUserWithEmailAndPassword(this.doctorInfo.emailId, this.password)
                .then(function (data) {
                console.log('Registered with email ' + _this.doctorInfo.emailId);
                _this.doctorInfo.state = _this.selectedState;
                _this.doctorInfo.hospitalName = _this.selectedHospital;
                _this.db.list(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + data.uid).push(_this.doctorInfo);
                _this.doctorInfo['uid'] = data.uid;
                _this.navCtrl.setRoot(DoctorMenuPage, _this.doctorInfo);
            })
                .catch(function (error) {
                console.log('Registration error : ', error.message);
                _this.utilityProvider.showAlert('Error', error.message);
            });
            // }
        }
        else {
            this.utilityProvider.showAlert('Error', 'Both passwords do not match!');
        }
    };
    // validateUPRN(uprn: string){
    //   return true;
    // }
    DoctorRegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DoctorRegisterPage');
    };
    DoctorRegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-doctor-register',
            templateUrl: 'doctor-register.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UtilityProvider,
            AlertController, AngularFireAuth, Storage,
            AngularFireDatabase, RestProvider])
    ], DoctorRegisterPage);
    return DoctorRegisterPage;
}());
export { DoctorRegisterPage };
//# sourceMappingURL=doctor-register.js.map