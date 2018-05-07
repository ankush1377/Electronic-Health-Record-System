import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

import {DoctorHomePage} from '../doctor-home/doctor-home';

import { UtilityProvider } from '../../providers/utility/utility';

import { UploadedRecordsModalComponent } from '../../components/uploaded-records-modal/uploaded-records-modal';

import * as constants from '../../constants';

/**
 * Generated class for the DoctorMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctor-menu',
  templateUrl: 'doctor-menu.html',
})
export class DoctorMenuPage {

	selectedSegment: string = 'patientCentre';
  pcSelection: string = 'validation';
  appointmentsSelection: string = 'upcoming';
  patientUid: string = "";
  storageRef: any;
  recordsAccessApproval: boolean = false;
  fileSelected: any = null;
  uploadEvent: any = null;
  database: any;
  today: number = Date.now();
  visitsOrder: string = 'timestamp';
  visitsReverse: boolean = true;
  recordsFilter: any = {startDate:'', endDate:''};
  uploadsChecked: boolean = true;
  appointmentsOrder: string = 'data.timestamp';
  appointmentsReverse: boolean = false;

  doctorInfo: any = {};
  patientInfo: any = {};
  recordsData: any = [];
  visitsData: any = [];  
  visitsDataFiltered: any = [];  
  appointmentsData: any = {pending:[], upcoming:[], completed:[]};
  visitFilesUploaded: any = {records : [], prescriptions : []};
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private utilityProvider: UtilityProvider,
    public alertCtrl: AlertController, private db: AngularFireDatabase, public loadingCtrl: LoadingController,
    private iab: InAppBrowser, private afAuth: AngularFireAuth, public appCtrl: App, public modalCtrl: ModalController) {
    
    this.doctorInfo = navParams.data;
    this.database = firebase.database();
    this.storageRef = firebase.storage().ref('/' + constants.STORAGE_DATA);

    this.fetchVisitsSummary();
    this.fetchAppointmentsData();

  }


  sendNotification(){
    var thisRef = this;
    this.recordsAccessApproval = false;
    
    if(this.validatePatientUID(this.patientUid)){
      var reference = this.database.ref(constants.DB_CREDENTIALS+'/'+constants.DB_CREDENTIALS_PATIENTS+'/'+this.patientUid);
      reference.on("value", (snapshot)=> {
        if(snapshot.val()){
          var k = Object.keys(snapshot.val());
          this.patientInfo = snapshot.val()[k[0]];
          this.db.list(constants.DB_NOTIFICATIONS+'/'+this.patientUid).push({
            sender: this.doctorInfo.uid,
            approval: constants.NOTIFICATION_STATUS_PENDING
          }).then( ()=>{

            var dbKey;
            let notificationsRefPromise = new Promise((resolve, reject) => {
              var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.patientUid);
              notificationsRef.on('value', (snapshot)=>{
                var notificationUpdate = snapshot.val();
                if(notificationUpdate){
                  var keys = Object.keys(notificationUpdate);
                  keys.forEach(function(key, index){
                    if(notificationUpdate[key].sender === thisRef.doctorInfo.uid){
                      dbKey = key;
                      if(notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_APPROVED.toUpperCase() || 
                        notificationUpdate[key].approval.toUpperCase() === constants.NOTIFICATION_STATUS_REJECTED.toUpperCase()){
                        resolve(notificationUpdate[key].approval);
                      }
                    }
                  });
                }
              })
            });

            notificationsRefPromise.then( (approval)=>{
              console.log(approval);
              var patientUid = this.patientUid;

              if(approval == constants.NOTIFICATION_STATUS_APPROVED){
                let confirm = this.alertCtrl.create({
                  title: 'Patient Approval',
                  message: 'Access request approved. Proceed further?',
                  buttons: [
                    {
                      text: 'No',
                      handler: () => {
                        console.log('Cancel clicked');
                        this.patientInfo = {};
                      }
                    },
                    {
                      text: 'Yes',
                      handler: () => {
                        console.log('Fetch patient records');
                        this.selectedSegment = 'patientCentre';
                        this.fetchPatientRecords(this.patientUid);
                        this.recordsAccessApproval = true;
                      }
                    }
                  ]
                });
                this.visitFilesUploaded = {records : [], prescriptions : []};
                confirm.present();
              }
              else if(approval == constants.NOTIFICATION_STATUS_REJECTED){
                this.utilityProvider.showAlert('Record Access', 'Sorry! The user did not approve this record access.');
                this.patientUid = '';
                this.patientInfo = {};
              }

              var update = {};
              update[constants.DB_NOTIFICATIONS + '/' + patientUid + '/' + dbKey] = null;
              this.database.ref().update(update);
            });

          });
        }
        else{
          this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
        }
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
    }
    else{
      this.utilityProvider.showAlert('Error','Please enter a valid patient UID');
    }
  }



  addDoctorVisit(){

    this.db.list(constants.DB_VISITS + '/' + this.doctorInfo.uid + '/' + this.patientUid).push({
      visitNumber: this.visitsData.length +1,
      timestamp: Date.now(),
      hospitalName: this.doctorInfo.hospitalName,
      filesUploaded: this.visitFilesUploaded
    });

  }



  fetchVisitsSummary(){
    console.log('fetchRecordsSummary');

    var thisRef = this; 
    let visitsPromise = new Promise((resolve, reject) => {
      var visitsRef = thisRef.database.ref(constants.DB_VISITS + '/' + thisRef.doctorInfo.uid);
      visitsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    visitsPromise.then( (visitsDataList)=>{
      thisRef.visitsData = [];
      
      if(visitsDataList){
        var patientUIDList = Object.keys(visitsDataList);
        patientUIDList.forEach(function(patientUID){
          var patientName;
          var reference = thisRef.database.ref(constants.DB_CREDENTIALS+'/'+constants.DB_CREDENTIALS_PATIENTS+'/'+patientUID);
          reference.on("value", (snapshot)=> {
            if(snapshot.val()){
              var key = Object.keys(snapshot.val());
              patientName = (snapshot.val())[key[0]].firstName + ' ' + (snapshot.val())[key[0]].lastName;

              var keys = Object.keys(visitsDataList[patientUID]);
              keys.forEach(function(key){

                var filesUploaded;
                if(!visitsDataList[patientUID][key].filesUploaded)
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
  }



  filterVisitsData(){

    if(!this.recordsFilter.startDate || !this.recordsFilter.endDate){
      this.utilityProvider.showAlert('Error', 'Please select filtering period!');
      return;
    }

    if(new Date(this.recordsFilter.startDate) > new Date(this.recordsFilter.endDate)){
      this.utilityProvider.showAlert('Error', 'Invalid period selected!');
      return;
    }

    var startDate = Number(new Date(this.recordsFilter.startDate));
    var date = new Date(this.recordsFilter.endDate);
    var endDate = Number(new Date(date.setTime(date.getTime() + 86400000)));
    this.visitsDataFiltered = [];
    var thisRef= this;

    this.visitsData.forEach(function(visit){
      if(visit.timestamp>=startDate && visit.timestamp<=endDate)
        thisRef.visitsDataFiltered.push(visit);
    });

  }



  fetchAppointmentsData(){
    console.log('fetchAppointmentsData');

    this.appointmentsData = {pending:[], upcoming:[], completed:[]};
    var thisRef = this; 
    
    let appointmentsPromise = new Promise((resolve, reject) => {
      var appointmentsRef = thisRef.database.ref(constants.DB_APPOINTMENTS + '/' + thisRef.doctorInfo.uid);
      appointmentsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    appointmentsPromise.then( (appointmentsData)=>{
      
      if(appointmentsData){
        var keys = Object.keys(appointmentsData);
        keys.forEach(function(key){

          var patientName;
          var reference = thisRef.database.ref(constants.DB_CREDENTIALS+'/'+constants.DB_CREDENTIALS_PATIENTS+'/'+appointmentsData[key]['patientUID']);
          reference.once("value", (snapshot)=> {
            if(snapshot.val()){
              var k = Object.keys(snapshot.val());
              patientName = (snapshot.val())[k[0]].firstName + ' ' + (snapshot.val())[k[0]].lastName;

              if(appointmentsData[key]['status']!==constants.APPOINTMENT_STATUS_REJECTED && new Date(appointmentsData[key]['timestamp'])<new Date()){
                 var update = {};
                 update[constants.DB_APPOINTMENTS + '/' + thisRef.doctorInfo.uid + '/' + key + '/status'] = constants.APPOINTMENT_STATUS_REJECTED;
                 thisRef.database.ref().update(update);
              }

              if(appointmentsData[key]['status']===constants.APPOINTMENT_STATUS_PENDING){
                thisRef.appointmentsData.pending.push({
                  key: key,
                  data: appointmentsData[key],
                  patientName: patientName
                });
              }
              else if(appointmentsData[key]['status']===constants.APPOINTMENT_STATUS_APPROVED){
                thisRef.appointmentsData.upcoming.push({
                  key: key,
                  data: appointmentsData[key],
                  patientName: patientName
                });
              }
              else if(appointmentsData[key]['status']===constants.APPOINTMENT_STATUS_REJECTED){
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
    }).catch((error)=>{
            console.log(error);
          });
  }



  fetchPatientRecords(uid){
    console.log('fetchPatientRecords');

    var thisRef = this; 
    let recordsPromise = new Promise((resolve, reject) => {
      var notificationsRef = thisRef.database.ref(constants.DB_RECORDS + '/' + uid);
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    recordsPromise.then( (records)=>{
      thisRef.recordsData = [];
      console.log(records);
      if(records){
        var keys = Object.keys(records);
        keys.forEach(function(key){
          thisRef.storageRef.child(uid + '/' + records[key].fileName).getDownloadURL().then(function(url) {
            thisRef.recordsData.push({
              fileName: records[key].fileName,
              url: url
            });
          })
        })
      }
    });
  }



  fetchReport(reportUrl){
    return this.iab.create(reportUrl);
  }



  chooseFile(event){
    this.fileSelected = event.target.files[0];
    this.uploadEvent = event;
  }



  uploadFile(patientUid){
    var thisRef = this;

    if(!thisRef.fileSelected){
      this.utilityProvider.showAlert('Error', 'Please select a file');
      return;
    }

    let uidCheckPromise = new Promise((resolve, reject) => {
      var database = firebase.database();
      var notificationsRef = database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_PATIENTS + '/' + patientUid);
      notificationsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    uidCheckPromise.then( (data)=>{
      if(!data || !patientUid){
        this.utilityProvider.showAlert('Error', 'Enter a valid patient UID');
        // this.fileSelected = null;
        // this.uploadEvent.target.files = null;
        return;
      }
    });

    if(thisRef.fileSelected && patientUid){
      console.log(thisRef.fileSelected);
      var uploadTask = this.storageRef.child(patientUid + '/' + thisRef.fileSelected.name).put(thisRef.fileSelected);
      uploadTask.on('state_changed', function(snapshot){
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
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
    //    console.log(downloadURL);
        thisRef.visitFilesUploaded.records.push({
          fileName: thisRef.fileSelected.name,
          url: downloadURL
        });
        thisRef.db.list(constants.DB_RECORDS + '/' + patientUid).push({
          fileName: thisRef.fileSelected.name,
          url: downloadURL
        });
        if(thisRef.recordsAccessApproval)
          thisRef.fetchPatientRecords(patientUid);
      });
    }
  }



  filterUploadVisits(uploadsChecked: boolean){
    if(uploadsChecked===true){
      this.visitsDataFiltered = this.visitsData;
    }
    else{
      this.visitsDataFiltered = [];
      var thisRef= this;
      this.visitsData.forEach(function(visitData){
        if(visitData.filesUploaded!=false)
          thisRef.visitsDataFiltered.push(visitData);
      });
    }
  }



  logoutUser(){
    this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, DoctorHomePage);
  }



  validatePatientUID(patientUID: string){
    if(patientUID=='' || patientUID.indexOf('.')>-1 || patientUID.indexOf('#')>-1 || patientUID.indexOf('$')>-1 || 
      patientUID.indexOf('[')>-1 || patientUID.indexOf(']')>-1 )
      return false;
    return true;
  }



  newPatient(){

    let confirm = this.alertCtrl.create({
      title: 'New Patient',
      message: 'Are you sure you want to check a new patient?',
      buttons: [
      {
          text: 'No',
          handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          console.log('New patient');

          this.addDoctorVisit();
          this.fetchVisitsSummary();

          this.recordsAccessApproval = false;
          this.patientUid = "";
          this.recordsData = [];
          this.patientInfo = {};
          this.selectedSegment = 'patientCentre';
          this.pcSelection = 'validation';
          }
        }
      ]
    });
    confirm.present();

  }


  noRecordsUploaded(visitRecord){

    if(!visitRecord.filesUploaded)
      return true;

    if(visitRecord.filesUploaded.records.length==0)
      return true;

    return false;
  }



  openRecordsList(visitRecord){
    console.log(visitRecord);
    let modal = this.modalCtrl.create(UploadedRecordsModalComponent, visitRecord);
    modal.present();
  }


  addRecord(){
    this.selectedSegment = 'patientCentre';
    this.pcSelection = 'report';
  }

  addPrescription(){
   this.selectedSegment = 'patientCentre'; 
   this.pcSelection = 'prescription';
  }

  approveAppointment(appointment){
    let confirm = this.alertCtrl.create({
      title: 'Appointment Approval',
      message: 'Are you sure you want to approve this appointment?',
      buttons: [
      {
        text: 'No',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
       text: 'Yes',
       handler: () => {
         console.log('Appointment approved');
         var update = {};
         update[constants.DB_APPOINTMENTS + '/' + this.doctorInfo.uid + '/' + appointment.key + '/status'] = constants.APPOINTMENT_STATUS_APPROVED;
         this.database.ref().update(update);
         this.fetchAppointmentsData();
       }
     }
     ]
   });
    confirm.present();
  }

  refuseAppointment(appointment){
    let confirm = this.alertCtrl.create({
      title: 'Appointment Approval',
      message: 'Are you sure you want to reject this appointment?',
      buttons: [
      {
        text: 'No',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
       text: 'Yes',
       handler: () => {
         console.log('Appointment rejected');
         var update = {};
         update[constants.DB_APPOINTMENTS + '/' + this.doctorInfo.uid + '/' + appointment.key + '/status'] = constants.APPOINTMENT_STATUS_REJECTED;
         this.database.ref().update(update);
         this.fetchAppointmentsData();
       }
     }
     ]
   });
    confirm.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMenuPage');
  }

}