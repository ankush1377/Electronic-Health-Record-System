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

@IonicPage()
@Component({
  selector: 'page-doctor-register',
  templateUrl: 'doctor-register.html',
})
export class DoctorRegisterPage {

  doctorInfo: any = {};
	password: string = "";
	cPassword: string = "";
  hospitalList: any = [];
  stateList: any = [{"code":"AN","name":"Andaman and Nicobar Islands"},{"code":"AP","name":"Andhra Pradesh"},{"code":"AR","name":"Arunachal Pradesh"},{"code":"AS","name":"Assam"},{"code":"BR","name":"Bihar"},{"code":"CG","name":"Chandigarh"},{"code":"CH","name":"Chhattisgarh"},{"code":"DH","name":"Dadra and Nagar Haveli"},{"code":"DD","name":"Daman and Diu"},{"code":"DL","name":"Delhi"},{"code":"GA","name":"Goa"},{"code":"GJ","name":"Gujarat"},{"code":"HR","name":"Haryana"},{"code":"HP","name":"Himachal Pradesh"},{"code":"JK","name":"Jammu and Kashmir"},{"code":"JH","name":"Jharkhand"},{"code":"KA","name":"Karnataka"},{"code":"KL","name":"Kerala"},{"code":"LD","name":"Lakshadweep"},{"code":"MP","name":"Madhya Pradesh"},{"code":"MH","name":"Maharashtra"},{"code":"MN","name":"Manipur"},{"code":"ML","name":"Meghalaya"},{"code":"MZ","name":"Mizoram"},{"code":"NL","name":"Nagaland"},{"code":"OR","name":"Odisha"},{"code":"PY","name":"Puducherry"},{"code":"PB","name":"Punjab"},{"code":"RJ","name":"Rajasthan"},{"code":"SK","name":"Sikkim"},{"code":"TN","name":"Tamil Nadu"},{"code":"TS","name":"Telangana"},{"code":"TR","name":"Tripura"},{"code":"UP","name":"Uttar Pradesh"},{"code":"UK","name":"Uttarakhand"},{"code":"WB","name":"West Bengal"}];
  departmentList: any = [];
  selectedState = 'initial';
  selectedHospital = 'initial';

  constructor(public navCtrl: NavController, public navParams: NavParams, private utilityProvider: UtilityProvider,
  	public alertCtrl: AlertController, private afAuth: AngularFireAuth, private storage: Storage,
  	private db: AngularFireDatabase, public restProvider: RestProvider ) { 
    this.hospitalList.hospitals = [];
    this.hospitalList.dispensaries = [];
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
  }


  registerDoctor(){
  	
  	if(this.doctorInfo.emailId == ""){
      this.utilityProvider.showAlert('Error', 'Please enter email id');
      return;
    }

    if(this.password == ""){
      this.utilityProvider.showAlert('Error', 'Please enter password');
      return;
    }

    if(this.cPassword == ""){
      this.utilityProvider.showAlert('Error', 'Please confirm your password');
      return;
    }

    if(this.password == this.cPassword){
      if(this.validateUPRN(this.doctorInfo.uprn)){
        this.afAuth.auth.createUserWithEmailAndPassword(this.doctorInfo.emailId, this.password)
        .then(data=>{
          console.log('Registered with email ' + this.doctorInfo.emailId);
            this.storage.set('emailId', this.doctorInfo.emailId);
            this.storage.set('password', this.password);
            this.db.list(constants.DB_CREDENTIALS + '/' + constants.DB_CREDENTIALS_DOCTORS + '/' + data.uid).push(this.doctorInfo);
            this.doctorInfo['uid'] = data.uid;
            this.navCtrl.setRoot(DoctorMenuPage, this.doctorInfo);
        })
        .catch(error=>{
          console.log('Registration error : ', error.message);
          this.utilityProvider.showAlert('Error', error.message);
        })
      }
  	}
  	else{
		  this.utilityProvider.showAlert('Error', 'Both passwords do not match!');
  	}
  }

  validateUPRN(uprn: string){
    return true;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorRegisterPage');
  }

}
