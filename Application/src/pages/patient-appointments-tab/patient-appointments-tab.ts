import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, App, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';

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

@Component({
  selector: 'page-patient-appointments-tab',
  templateUrl: 'patient-appointments-tab.html',
})
export class PatientAppointmentsTabPage {

  userData: any = {};
  notificationsData: any = {};
  notifications: number;
  database: any;
  appointmentsData: any = [];
  hospitalList: any = [];
  stateList: any = [{"code":"AN","name":"Andaman and Nicobar Islands"},{"code":"AP","name":"Andhra Pradesh"},{"code":"AR","name":"Arunachal Pradesh"},{"code":"AS","name":"Assam"},{"code":"BR","name":"Bihar"},{"code":"CG","name":"Chandigarh"},{"code":"CH","name":"Chhattisgarh"},{"code":"DH","name":"Dadra and Nagar Haveli"},{"code":"DD","name":"Daman and Diu"},{"code":"DL","name":"Delhi"},{"code":"GA","name":"Goa"},{"code":"GJ","name":"Gujarat"},{"code":"HR","name":"Haryana"},{"code":"HP","name":"Himachal Pradesh"},{"code":"JK","name":"Jammu and Kashmir"},{"code":"JH","name":"Jharkhand"},{"code":"KA","name":"Karnataka"},{"code":"KL","name":"Kerala"},{"code":"LD","name":"Lakshadweep"},{"code":"MP","name":"Madhya Pradesh"},{"code":"MH","name":"Maharashtra"},{"code":"MN","name":"Manipur"},{"code":"ML","name":"Meghalaya"},{"code":"MZ","name":"Mizoram"},{"code":"NL","name":"Nagaland"},{"code":"OR","name":"Odisha"},{"code":"PY","name":"Puducherry"},{"code":"PB","name":"Punjab"},{"code":"RJ","name":"Rajasthan"},{"code":"SK","name":"Sikkim"},{"code":"TN","name":"Tamil Nadu"},{"code":"TS","name":"Telangana"},{"code":"TR","name":"Tripura"},{"code":"UP","name":"Uttar Pradesh"},{"code":"UK","name":"Uttarakhand"},{"code":"WB","name":"West Bengal"}];
  departmentList: any = [];
  doctorList: any = [];
  selectedState = 'initial';
  selectedHospital = 'initial';
  selectedDoctor = 'initial';
  selectedSegment: string = 'upcoming'; 
  appointmentDate: Date;
  appointmentTime: Date;
  appointmentsOrder: string = 'data.timestamp';
  appointmentsReverse: boolean = false;

  constructor(private afAuth: AngularFireAuth, private notificationsProvider: NotificationsProvider, public alertCtrl: AlertController,
    private utilityProvider: UtilityProvider, public appCtrl: App, public navCtrl: NavController, private db: AngularFireDatabase,
    public navParams: NavParams, public popoverCtrl: PopoverController, public restProvider: RestProvider) {

    this.userData = navParams.data;
    this.hospitalList.hospitals = [];
    this.hospitalList.dispensaries = [];

    this.notificationsData['receiverUid'] = this.userData.uid;
    this.notificationsData['notificationsList'] = [];

    this.database = firebase.database();
    var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + this.userData.uid);
    notificationsRef.on('value', (snapshot)=>{
      notificationsProvider.pollNotifications(this.database, this.notificationsData);      
    });

    this.fetchPatientAppointments();

  }


  setHospitalList(){
    var thisRef = this;
    
    thisRef.restProvider.getHospitalData(this.selectedState).then(function(data){
      console.log(data);
      thisRef.hospitalList.hospitals = data['records'];
    });

    thisRef.restProvider.getDispensaryData(this.selectedState).then(function(data){
      console.log(data);
      thisRef.hospitalList.dispensaries = data['records'];
    });

    thisRef.selectedHospital = 'initial';
    thisRef.selectedDoctor = 'initial';
    thisRef.doctorList = [];
  }


  setDoctorList(){
    var thisRef = this; 
    let doctorPromise = new Promise((resolve, reject) => {
      var doctorRef = thisRef.database.ref(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS);
      doctorRef.once('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    doctorPromise.then( (doctorDataList)=>{
      thisRef.doctorList = [];

      var doctorIDS = Object.keys(doctorDataList);
      doctorIDS.forEach(function(doctorID){
        var key = (Object.keys(doctorDataList[doctorID]))[0];
        if(doctorDataList[doctorID][key]['hospitalName']===thisRef.selectedHospital)
          thisRef.doctorList.push({
            uid: doctorID, 
            info: doctorDataList[doctorID][key]
          });
      });
    });

    this.selectedDoctor = 'initial';
  }


  createAppointment(){

    if(!this.selectedDoctor || this.selectedDoctor=='initial'){
      this.utilityProvider.showAlert('Error', 'Please select the doctor!');
      return;
    }

    if(!this.appointmentDate){
      this.utilityProvider.showAlert('Error', 'Please select a suitable date!');
      return;
    }

    if(!this.appointmentTime){
      this.utilityProvider.showAlert('Error', 'Please select a suitable time!');
      return;
    }

    var timestamp = new Date(this.appointmentDate+'T'+this.appointmentTime);
    if(timestamp<new Date()){
      this.utilityProvider.showAlert('Error', 'Must select a future date and time!');
      return;
    }

    let confirm = this.alertCtrl.create({
      title: 'New Appointment',
      message: 'Are you sure you want to set up this appointment?',
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
          this.db.list(constants.DB_APPOINTMENTS + '/' + this.selectedDoctor).push({
            patientUID: this.userData.uid,
            status: constants.APPOINTMENT_STATUS_PENDING,
            timestamp: timestamp.toString(),
          });        
        }
      }]
    });
    confirm.present();

  }


  fetchPatientAppointments(){
    console.log('fetchPatientAppointments');

    this.appointmentsData = [];
    var thisRef = this; 
    
    let appointmentsPromise = new Promise((resolve, reject) => {
      var appointmentsRef = thisRef.database.ref(constants.DB_APPOINTMENTS);
      appointmentsRef.on('value', (snapshot)=>{
        resolve(snapshot.val());
      });
    });

    appointmentsPromise.then( (appointmentsData)=>{
      
      if(appointmentsData){
        var doctorUidList = Object.keys(appointmentsData);
        doctorUidList.forEach(function(doctorUid){

          var keys = Object.keys(appointmentsData[doctorUid]);
          keys.forEach(function(key){
            
            if(appointmentsData[doctorUid][key].patientUID===thisRef.userData.uid){

              var doctorName;
              var reference = thisRef.database.ref(constants.DB_CREDENTIALS+'/'+constants.DB_CREDENTIALS_DOCTORS+'/'+doctorUid);
              reference.once("value", (snapshot)=> {
                if(snapshot.val()){
                  
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
    }).catch((error)=>{
      console.log(error);
    });

    console.log(thisRef.appointmentsData);
  }


  presentNotifications(event){
    this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
  }


  logoutUser(){
    this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientAppointmentsTabPage');
  }

}
