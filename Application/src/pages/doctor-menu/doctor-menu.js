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
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { DoctorHomePage } from '../doctor-home/doctor-home';
import { UtilityProvider } from '../../providers/utility/utility';
import { UploadedRecordsModalComponent } from '../../components/uploaded-records-modal/uploaded-records-modal';
import * as constants from '../../constants';
/**
 * Generated class for the DoctorMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DoctorMenuPage = /** @class */ (function () {
    function DoctorMenuPage(navCtrl, navParams, utilityProvider, alertCtrl, db, loadingCtrl, iab, afAuth, appCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.utilityProvider = utilityProvider;
        this.alertCtrl = alertCtrl;
        this.db = db;
        this.loadingCtrl = loadingCtrl;
        this.iab = iab;
        this.afAuth = afAuth;
        this.appCtrl = appCtrl;
        this.modalCtrl = modalCtrl;
        this.selectedSegment = 'patientCentre';
        this.pcSelection = 'validation';
        this.appointmentsSelection = 'upcoming';
        this.patientUid = "";
        this.recordsAccessApproval = false;
        this.reportFileSelected = null;
        this.prescriptionFileSelected = null;
        this.reportUploadEvent = null;
        this.prescriptionUploadEvent = null;
        this.today = Date.now();
        this.visitsOrder = 'timestamp';
        this.visitsReverse = true;
        this.recordsFilter = { startDate: '', endDate: '' };
        this.uploadsChecked = true;
        this.appointmentsOrder = 'data.timestamp';
        this.appointmentsReverse = false;
        this.prescriptionType = 'file';
        this.doctorInfo = {};
        this.patientInfo = {};
        this.filesData = { records: [], prescriptions: [] };
        this.visitsData = [];
        this.visitsDataFiltered = [];
        this.appointmentsData = { pending: [], upcoming: [], completed: [] };
        this.visitFilesUploaded = { records: [], prescriptions: [] };
        this.doctorInfo = navParams.data;
        this.database = firebase.database();
        this.storageRef = firebase.storage().ref('/' + constants.STORAGE_DATA);
        this.fetchVisitsSummary();
        this.fetchAppointmentsData();
    }
    DoctorMenuPage.prototype.sendNotification = function () {
        var _this = this;
        var thisRef = this;
        this.recordsAccessApproval = false;
        if (this.validatePatientUID(this.patientUid)) {
            var reference = this.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + this.patientUid);
            reference.on("value", function (snapshot) {
                if (snapshot.val()) {
                    var k = Object.keys(snapshot.val());
                    _this.patientInfo = snapshot.val()[k[0]];
                    _this.db.list(constants.DB_NOTIFICATIONS + '/' + _this.patientUid).push({
                        sender: _this.doctorInfo.uid,
                        approval: constants.NOTIFICATION_STATUS_PENDING
                    }).then(function () {
                        var dbKey;
                        var notificationsRefPromise = new Promise(function (resolve, reject) {
                            var notificationsRef = _this.database.ref(constants.DB_NOTIFICATIONS + '/' + _this.patientUid);
                            notificationsRef.on('value', function (snapshot) {
                                var notificationUpdate = snapshot.val();
                                if (notificationUpdate) {
                                    var keys = Object.keys(notificationUpdate);
                                    keys.forEach(function (key, index) {
                                        if (notificationUpdate[key].sender === thisRef.doctorInfo.uid) {
                                            dbKey = key;
                                            if (notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_APPROVED.toUpperCase() ||
                                                notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_REJECTED.toUpperCase()) {
                                                resolve(notificationUpdate[key].approval);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        notificationsRefPromise.then(function (approval) {
                            console.log(approval);
                            var patientUid = _this.patientUid;
                            if (approval == constants.NOTIFICATION_STATUS_APPROVED) {
                                var confirm_1 = _this.alertCtrl.create({
                                    title: 'Patient Approval',
                                    message: 'Access request approved. Proceed further?',
                                    buttons: [
                                        {
                                            text: 'No',
                                            handler: function () {
                                                console.log('Cancel clicked');
                                                _this.patientInfo = {};
                                            }
                                        },
                                        {
                                            text: 'Yes',
                                            handler: function () {
                                                console.log('Fetch patient records');
                                                _this.selectedSegment = 'patientCentre';
                                                _this.fetchPatientFiles(_this.patientUid);
                                                _this.patientAge = _this.utilityProvider.calculateAge(new Date(_this.patientInfo.dateOfBirth));
                                                _this.recordsAccessApproval = true;
                                            }
                                        }
                                    ]
                                });
                                _this.visitFilesUploaded = { records: [], prescriptions: [] };
                                confirm_1.present();
                            }
                            else if (approval == constants.NOTIFICATION_STATUS_REJECTED) {
                                _this.utilityProvider.showAlert('Record Access', 'Sorry! The user did not approve this record access.');
                                _this.patientUid = '';
                                _this.patientInfo = {};
                            }
                            var update = {};
                            update[constants.DB_NOTIFICATIONS + '/' + patientUid + '/' + dbKey] = null;
                            _this.database.ref().update(update);
                        });
                    });
                }
                else {
                    _this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }
        else {
            this.utilityProvider.showAlert('Error', 'Please enter a valid patient UID');
        }
    };
    DoctorMenuPage.prototype.addDoctorVisit = function () {
        this.db.list(constants.DB_VISITS + '/' + this.doctorInfo.uid + '/' + this.patientUid).push({
            visitNumber: this.visitsData.length + 1,
            timestamp: Date.now(),
            hospitalName: this.doctorInfo.hospitalName,
            filesUploaded: this.visitFilesUploaded
        });
    };
    DoctorMenuPage.prototype.fetchVisitsSummary = function () {
        console.log('fetchVisitsSummary');
        var thisRef = this;
        var visitsPromise = new Promise(function (resolve, reject) {
            var visitsRef = thisRef.database.ref(constants.DB_VISITS + '/' + thisRef.doctorInfo.uid);
            visitsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        visitsPromise.then(function (visitsDataList) {
            thisRef.visitsData = [];
            if (visitsDataList) {
                var patientUIDList = Object.keys(visitsDataList);
                patientUIDList.forEach(function (patientUID) {
                    var patientName;
                    var reference = thisRef.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + patientUID);
                    reference.on("value", function (snapshot) {
                        if (snapshot.val()) {
                            var key = Object.keys(snapshot.val());
                            patientName = (snapshot.val())[key[0]].firstName + ' ' + (snapshot.val())[key[0]].lastName;
                            var keys = Object.keys(visitsDataList[patientUID]);
                            keys.forEach(function (key) {
                                var filesUploaded;
                                if (!visitsDataList[patientUID][key].filesUploaded)
                                    filesUploaded = false;
                                else
                                    filesUploaded = visitsDataList[patientUID][key].filesUploaded;
                                thisRef.visitsData.push({
                                    visitNumber: visitsDataList[patientUID][key].visitNumber,
                                    patientUID: patientUID,
                                    patientName: patientName,
                                    timestamp: visitsDataList[patientUID][key].timestamp,
                                    hospitalName: visitsDataList[patientUID][key].hospitalName,
                                    filesUploaded: filesUploaded
                                });
                            });
                        }
                    });
                });
            }
            thisRef.visitsDataFiltered = thisRef.visitsData;
            //      console.log(thisRef.visitsDataFiltered);
        });
    };
    DoctorMenuPage.prototype.filterVisitsData = function () {
        if (!this.recordsFilter.startDate || !this.recordsFilter.endDate) {
            this.utilityProvider.showAlert('Error', 'Please select filtering period!');
            return;
        }
        if (new Date(this.recordsFilter.startDate) > new Date(this.recordsFilter.endDate)) {
            this.utilityProvider.showAlert('Error', 'Invalid period selected!');
            return;
        }
        var startDate = Number(new Date(this.recordsFilter.startDate));
        var date = new Date(this.recordsFilter.endDate);
        var endDate = Number(new Date(date.setTime(date.getTime() + 86400000)));
        this.visitsDataFiltered = [];
        var thisRef = this;
        this.visitsData.forEach(function (visit) {
            if (visit.timestamp >= startDate && visit.timestamp <= endDate)
                thisRef.visitsDataFiltered.push(visit);
        });
    };
    DoctorMenuPage.prototype.fetchAppointmentsData = function () {
        console.log('fetchAppointmentsData');
        this.appointmentsData = { pending: [], upcoming: [], completed: [] };
        var thisRef = this;
        var appointmentsPromise = new Promise(function (resolve, reject) {
            var appointmentsRef = thisRef.database.ref(constants.DB_APPOINTMENTS + '/' + thisRef.doctorInfo.uid);
            appointmentsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        appointmentsPromise.then(function (appointmentsData) {
            if (appointmentsData) {
                var keys = Object.keys(appointmentsData);
                keys.forEach(function (key) {
                    var patientName;
                    var reference = thisRef.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + appointmentsData[key]['patientUID']);
                    reference.once("value", function (snapshot) {
                        if (snapshot.val()) {
                            var k = Object.keys(snapshot.val());
                            patientName = (snapshot.val())[k[0]].firstName + ' ' + (snapshot.val())[k[0]].lastName;
                            if (appointmentsData[key]['status'] !== constants.APPOINTMENT_STATUS_REJECTED && new Date(appointmentsData[key]['timestamp']) < new Date()) {
                                var update = {};
                                update[constants.DB_APPOINTMENTS + '/' + thisRef.doctorInfo.uid + '/' + key + '/status'] = constants.APPOINTMENT_STATUS_REJECTED;
                                thisRef.database.ref().update(update);
                            }
                            if (appointmentsData[key]['status'] === constants.APPOINTMENT_STATUS_PENDING) {
                                thisRef.appointmentsData.pending.push({
                                    key: key,
                                    data: appointmentsData[key],
                                    patientName: patientName
                                });
                            }
                            else if (appointmentsData[key]['status'] === constants.APPOINTMENT_STATUS_APPROVED) {
                                thisRef.appointmentsData.upcoming.push({
                                    key: key,
                                    data: appointmentsData[key],
                                    patientName: patientName
                                });
                            }
                            else if (appointmentsData[key]['status'] === constants.APPOINTMENT_STATUS_REJECTED) {
                                thisRef.appointmentsData.completed.push({
                                    key: key,
                                    data: appointmentsData[key],
                                    patientName: patientName
                                });
                            }
                        }
                    });
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
    DoctorMenuPage.prototype.fetchPatientFiles = function (uid) {
        console.log('fetchPatientFiles');
        var thisRef = this;
        var filesPromise = new Promise(function (resolve, reject) {
            var notificationsRef = thisRef.database.ref(constants.DB_FILES + '/' + uid);
            notificationsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        filesPromise.then(function (files) {
            thisRef.filesData = { records: [], prescriptions: [] };
            console.log(files);
            if (files) {
                if (files['records']) {
                    var keys = Object.keys(files["records"]);
                    keys.forEach(function (key) {
                        thisRef.filesData.records.push({
                            fileName: files['records'][key].fileName,
                            url: files['records'][key].url
                        });
                    });
                }
                if (files['prescriptions']) {
                    keys = Object.keys(files["prescriptions"]);
                    keys.forEach(function (key) {
                        thisRef.filesData.prescriptions.push({
                            fileName: files['prescriptions'][key].fileName,
                            url: files['prescriptions'][key].url
                        });
                    });
                }
            }
        });
    };
    DoctorMenuPage.prototype.fetchReport = function (reportUrl) {
        return this.iab.create(reportUrl);
    };
    DoctorMenuPage.prototype.chooseFile = function (event, section) {
        if (section === 'report') {
            this.reportFileSelected = event.target.files[0];
            this.reportUploadEvent = event;
        }
        else if (section === 'prescription') {
            this.prescriptionFileSelected = event.target.files[0];
            this.prescriptionUploadEvent = event;
        }
    };
    DoctorMenuPage.prototype.uploadReport = function (patientUid) {
        var _this = this;
        var thisRef = this;
        if (!thisRef.reportFileSelected) {
            this.utilityProvider.showAlert('Error', 'Please select a file');
            return;
        }
        var uidCheckPromise = new Promise(function (resolve, reject) {
            var database = firebase.database();
            var notificationsRef = database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + patientUid);
            notificationsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        uidCheckPromise.then(function (data) {
            if (!data || !patientUid) {
                _this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
                // this.fileSelected = null;
                // this.uploadEvent.target.files = null;
                return;
            }
        });
        if (thisRef.reportFileSelected && patientUid) {
            var uploadTask = this.storageRef.child(patientUid + '/records/' + thisRef.reportFileSelected.name).put(thisRef.reportFileSelected);
            uploadTask.on('state_changed', function (snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var downloadURL = uploadTask.snapshot.downloadURL;
                //    console.log(downloadURL);
                thisRef.visitFilesUploaded.records.push({
                    fileName: thisRef.reportFileSelected.name,
                    url: downloadURL
                });
                thisRef.db.list(constants.DB_FILES + '/' + patientUid + '/' + constants.DB_FILES_RECORDS).push({
                    fileName: thisRef.reportFileSelected.name,
                    url: downloadURL
                });
                if (thisRef.recordsAccessApproval)
                    thisRef.fetchPatientFiles(patientUid);
            });
        }
    };
    DoctorMenuPage.prototype.uploadPrescription = function (patientUid) {
        var _this = this;
        var thisRef = this;
        if (!thisRef.prescriptionFileSelected) {
            this.utilityProvider.showAlert('Error', 'Please select a file');
            return;
        }
        var uidCheckPromise = new Promise(function (resolve, reject) {
            var database = firebase.database();
            var notificationsRef = database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + patientUid);
            notificationsRef.on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        });
        uidCheckPromise.then(function (data) {
            if (!data || !patientUid) {
                _this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
                // this.fileSelected = null;
                // this.uploadEvent.target.files = null;
                return;
            }
        });
        if (thisRef.prescriptionFileSelected && patientUid) {
            console.log(thisRef.prescriptionFileSelected);
            var uploadTask = this.storageRef.child(patientUid + '/prescriptions/' + thisRef.prescriptionFileSelected.name).put(thisRef.prescriptionFileSelected);
            uploadTask.on('state_changed', function (snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var downloadURL = uploadTask.snapshot.downloadURL;
                //    console.log(downloadURL);
                thisRef.visitFilesUploaded.prescriptions.push({
                    fileName: thisRef.prescriptionFileSelected.name,
                    url: downloadURL
                });
                thisRef.db.list(constants.DB_FILES + '/' + patientUid + '/' + constants.DB_FILES_PRESCRIPTIONS).push({
                    fileName: thisRef.prescriptionFileSelected.name,
                    url: downloadURL
                });
                if (thisRef.recordsAccessApproval)
                    thisRef.fetchPatientFiles(patientUid);
            });
        }
    };
    DoctorMenuPage.prototype.filterUploadVisits = function (uploadsChecked) {
        if (uploadsChecked === true) {
            this.visitsDataFiltered = this.visitsData;
        }
        else {
            this.visitsDataFiltered = [];
            var thisRef = this;
            this.visitsData.forEach(function (visitData) {
                if (visitData.filesUploaded != false)
                    thisRef.visitsDataFiltered.push(visitData);
            });
        }
    };
    DoctorMenuPage.prototype.logoutUser = function () {
        this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, DoctorHomePage);
    };
    DoctorMenuPage.prototype.validatePatientUID = function (patientUID) {
        if (patientUID == '' || patientUID.indexOf('.') > -1 || patientUID.indexOf('#') > -1 || patientUID.indexOf('$') > -1 ||
            patientUID.indexOf('[') > -1 || patientUID.indexOf(']') > -1)
            return false;
        return true;
    };
    DoctorMenuPage.prototype.newPatient = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'New Patient',
            message: 'Are you sure you want to check a new patient?',
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
                        console.log('New patient');
                        _this.addDoctorVisit();
                        _this.fetchVisitsSummary();
                        _this.recordsAccessApproval = false;
                        _this.patientUid = "";
                        _this.filesData = [];
                        _this.patientInfo = {};
                        _this.selectedSegment = 'patientCentre';
                        _this.pcSelection = 'validation';
                    }
                }
            ]
        });
        confirm.present();
    };
    DoctorMenuPage.prototype.noRecordsUploaded = function (visitRecord) {
        if (!visitRecord.filesUploaded)
            return true;
        if (visitRecord.filesUploaded.records.length == 0)
            return true;
        return false;
    };
    DoctorMenuPage.prototype.openRecordsList = function (visitRecord) {
        console.log(visitRecord);
        var modal = this.modalCtrl.create(UploadedRecordsModalComponent, visitRecord);
        modal.present();
    };
    DoctorMenuPage.prototype.addRecord = function () {
        this.selectedSegment = 'patientCentre';
        this.pcSelection = 'report';
    };
    DoctorMenuPage.prototype.addPrescription = function () {
        this.selectedSegment = 'patientCentre';
        this.pcSelection = 'prescription';
    };
    DoctorMenuPage.prototype.approveAppointment = function (appointment) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Appointment Approval',
            message: 'Are you sure you want to approve this appointment?',
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
                        console.log('Appointment approved');
                        var update = {};
                        update[constants.DB_APPOINTMENTS + '/' + _this.doctorInfo.uid + '/' + appointment.key + '/status'] = constants.APPOINTMENT_STATUS_APPROVED;
                        _this.database.ref().update(update);
                        _this.fetchAppointmentsData();
                    }
                }
            ]
        });
        confirm.present();
    };
    DoctorMenuPage.prototype.refuseAppointment = function (appointment) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Appointment Approval',
            message: 'Are you sure you want to reject this appointment?',
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
                        console.log('Appointment rejected');
                        var update = {};
                        update[constants.DB_APPOINTMENTS + '/' + _this.doctorInfo.uid + '/' + appointment.key + '/status'] = constants.APPOINTMENT_STATUS_REJECTED;
                        _this.database.ref().update(update);
                        _this.fetchAppointmentsData();
                    }
                }
            ]
        });
        confirm.present();
    };
    DoctorMenuPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DoctorMenuPage');
    };
    DoctorMenuPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-doctor-menu',
            templateUrl: 'doctor-menu.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UtilityProvider,
            AlertController, AngularFireDatabase, LoadingController,
            InAppBrowser, AngularFireAuth, App, ModalController])
    ], DoctorMenuPage);
    return DoctorMenuPage;
}());
export { DoctorMenuPage };
//# sourceMappingURL=doctor-menu.js.map