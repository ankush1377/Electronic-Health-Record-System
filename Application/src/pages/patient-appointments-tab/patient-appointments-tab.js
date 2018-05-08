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
import { NavController, NavParams, PopoverController, App, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { PatientHomePage } from '../patient-home/patient-home';
import { UtilityProvider } from '../../providers/utility/utility';
import { RestProvider } from '../../providers/rest/rest';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import * as constants from '../../constants';
/**
 * Generated class for the PatientAppointmentsTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PatientAppointmentsTabPage = /** @class */ (function () {
    function PatientAppointmentsTabPage(afAuth, notificationsProvider, alertCtrl, utilityProvider, appCtrl, navCtrl, db, navParams, popoverCtrl, restProvider) {
        var _this = this;
        this.afAuth = afAuth;
        this.notificationsProvider = notificationsProvider;
        this.alertCtrl = alertCtrl;
        this.utilityProvider = utilityProvider;
        this.appCtrl = appCtrl;
        this.navCtrl = navCtrl;
        this.db = db;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.restProvider = restProvider;
        this.userData = {};
        this.notificationsData = {};
        this.appointmentsData = [];
        this.hospitalList = [];
        this.stateList = [{ "code": "AN", "name": "Andaman and Nicobar Islands" }, { "code": "AP", "name": "Andhra Pradesh" }, { "code": "AR", "name": "Arunachal Pradesh" }, { "code": "AS", "name": "Assam" }, { "code": "BR", "name": "Bihar" }, { "code": "CG", "name": "Chandigarh" }, { "code": "CH", "name": "Chhattisgarh" }, { "code": "DH", "name": "Dadra and Nagar Haveli" }, { "code": "DD", "name": "Daman and Diu" }, { "code": "DL", "name": "Delhi" }, { "code": "GA", "name": "Goa" }, { "code": "GJ", "name": "Gujarat" }, { "code": "HR", "name": "Haryana" }, { "code": "HP", "name": "Himachal Pradesh" }, { "code": "JK", "name": "Jammu and Kashmir" }, { "code": "JH", "name": "Jharkhand" }, { "code": "KA", "name": "Karnataka" }, { "code": "KL", "name": "Kerala" }, { "code": "LD", "name": "Lakshadweep" }, { "code": "MP", "name": "Madhya Pradesh" }, { "code": "MH", "name": "Maharashtra" }, { "code": "MN", "name": "Manipur" }, { "code": "ML", "name": "Meghalaya" }, { "code": "MZ", "name": "Mizoram" }, { "code": "NL", "name": "Nagaland" }, { "code": "OR", "name": "Odisha" }, { "code": "PY", "name": "Puducherry" }, { "code": "PB", "name": "Punjab" }, { "code": "RJ", "name": "Rajasthan" }, { "code": "SK", "name": "Sikkim" }, { "code": "TN", "name": "Tamil Nadu" }, { "code": "TS", "name": "Telangana" }, { "code": "TR", "name": "Tripura" }, { "code": "UP", "name": "Uttar Pradesh" }, { "code": "UK", "name": "Uttarakhand" }, { "code": "WB", "name": "West Bengal" }];
        this.departmentList = [];
        this.doctorList = [];
        this.selectedState = 'initial';
        this.selectedHospital = 'initial';
        this.selectedDoctor = 'initial';
        this.selectedSegment = 'upcoming';
        this.appointmentsOrder = 'data.timestamp';
        this.appointmentsReverse = false;
        this.userData = navParams.data;
        this.hospitalList.hospitals = [];
        this.hospitalList.dispensaries = [];
        this.notificationsData['receiverUid'] = this.userData.uid;
        this.notificationsData['notificationsList'] = [];
        this.database = firebase.database();
        var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.userData.uid);
        notificationsRef.on('value', function (snapshot) {
            notificationsProvider.pollNotifications(_this.database, _this.notificationsData);
        });
        this.fetchPatientAppointments();
    }
    PatientAppointmentsTabPage.prototype.setHospitalList = function () {
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
        thisRef.selectedDoctor = 'initial';
        thisRef.doctorList = [];
    };
    PatientAppointmentsTabPage.prototype.setDoctorList = function () {
        var thisRef = this;
        var doctorPromise = new Promise(function (resolve, reject) {
            var doctorRef = thisRef.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS);
            doctorRef.once('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        doctorPromise.then(function (doctorDataList) {
            thisRef.doctorList = [];
            var doctorIDS = Object.keys(doctorDataList);
            doctorIDS.forEach(function (doctorID) {
                var key = (Object.keys(doctorDataList[doctorID]))[0];
                if (doctorDataList[doctorID][key]['hospitalName'] === thisRef.selectedHospital)
                    thisRef.doctorList.push({
                        uid: doctorID,
                        info: doctorDataList[doctorID][key]
                    });
            });
        });
        this.selectedDoctor = 'initial';
    };
    PatientAppointmentsTabPage.prototype.createAppointment = function () {
        var _this = this;
        if (!this.selectedDoctor || this.selectedDoctor == 'initial') {
            this.utilityProvider.showAlert('Error', 'Please select the doctor!');
            return;
        }
        if (!this.appointmentDate) {
            this.utilityProvider.showAlert('Error', 'Please select a suitable date!');
            return;
        }
        if (!this.appointmentTime) {
            this.utilityProvider.showAlert('Error', 'Please select a suitable time!');
            return;
        }
        var timestamp = new Date(this.appointmentDate + 'T' + this.appointmentTime);
        if (timestamp < new Date()) {
            this.utilityProvider.showAlert('Error', 'Must select a future date and time!');
            return;
        }
        var confirm = this.alertCtrl.create({
            title: 'New Appointment',
            message: 'Are you sure you want to set up this appointment?',
            buttons: [
                {
                    text: 'No',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        _this.db.list(constants.DB_APPOINTMENTS + '/' + _this.selectedDoctor).push({
                            patientUID: _this.userData.uid,
                            status: constants.APPOINTMENT_STATUS_PENDING,
                            timestamp: timestamp.toString(),
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
    PatientAppointmentsTabPage.prototype.fetchPatientAppointments = function () {
        console.log('fetchPatientAppointments');
        this.appointmentsData = [];
        var thisRef = this;
        var appointmentsPromise = new Promise(function (resolve, reject) {
            var appointmentsRef = thisRef.database.ref(constants.DB_APPOINTMENTS);
            appointmentsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        appointmentsPromise.then(function (appointmentsData) {
            if (appointmentsData) {
                var doctorUidList = Object.keys(appointmentsData);
                doctorUidList.forEach(function (doctorUid) {
                    var keys = Object.keys(appointmentsData[doctorUid]);
                    keys.forEach(function (key) {
                        if (appointmentsData[doctorUid][key].patientUID === thisRef.userData.uid) {
                            var doctorName;
                            var reference = thisRef.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + doctorUid);
                            reference.once("value", function (snapshot) {
                                if (snapshot.val()) {
                                    var k = Object.keys(snapshot.val());
                                    doctorName = (snapshot.val())[k[0]].firstName + ' ' + (snapshot.val())[k[0]].lastName;
                                    thisRef.appointmentsData.push({
                                        // key: key,
                                        doctorUid: doctorUid,
                                        data: appointmentsData[doctorUid][key],
                                        doctorName: doctorName
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
        console.log(thisRef.appointmentsData);
    };
    PatientAppointmentsTabPage.prototype.presentNotifications = function (event) {
        this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
    };
    PatientAppointmentsTabPage.prototype.logoutUser = function () {
        this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
    };
    PatientAppointmentsTabPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PatientAppointmentsTabPage');
    };
    PatientAppointmentsTabPage = __decorate([
        Component({
            selector: 'page-patient-appointments-tab',
            templateUrl: 'patient-appointments-tab.html',
        }),
        __metadata("design:paramtypes", [AngularFireAuth, NotificationsProvider, AlertController,
            UtilityProvider, App, NavController, AngularFireDatabase,
            NavParams, PopoverController, RestProvider])
    ], PatientAppointmentsTabPage);
    return PatientAppointmentsTabPage;
}());
export { PatientAppointmentsTabPage };
//# sourceMappingURL=patient-appointments-tab.js.map