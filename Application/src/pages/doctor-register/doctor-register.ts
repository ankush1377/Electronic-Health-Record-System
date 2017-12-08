import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import { DoctorMenuPage } from '../doctor-menu/doctor-menu';
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

	emailId: string = "";
	password: string = "";
	cpassword: string = "";
	firstName: string = "";
	lastName: string = "";
	gender: string = "";
	dateOfBirth: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public alertCtrl: AlertController, private afAuth: AngularFireAuth, private storage: Storage,
  	private db: AngularFireDatabase ) {
  }

  registerDoctor(){
  	
  	if(this.emailId == ""){
      this.showAlert('Error', 'Please enter email id');
      return;
    }

    if(this.password == ""){
      this.showAlert('Error', 'Please enter password');
      return;
    }

    if(this.cpassword == ""){
      this.showAlert('Error', 'Please confirm your password');
      return;
    }

    if(this.firstName == ""){
      this.showAlert('Error', 'Please enter first name');
      return;
    }
    
    if(this.lastName == ""){
      this.showAlert('Error', 'Please enter last name');
      return;
    }
    
    if(this.gender == ""){
      this.showAlert('Error', 'Please select gender');
      return;
    }

    if(this.dateOfBirth == ""){
      this.showAlert('Error', 'Please select date of birth');
      return;
    }

    if(this.password == this.cpassword){
  		this.afAuth.auth.createUserWithEmailAndPassword(this.emailId, this.password)
  		.then(data=>{
  			console.log('Registered with email ' + this.emailId);
	        this.storage.set('emailId', this.emailId);
	        this.storage.set('password', this.password);
	        var user = {
            uid: data.uid,
  		      emailId: this.emailId,
  		      firstName: this.firstName,
  		      lastName: this.lastName,
  		      gender: this.gender,
  		      dateOfBirth: this.dateOfBirth
		      };
  		    this.db.list('/credentials/doctors/' + data.uid).push({
  		      emailId : user.emailId,
  		      firstName : user.firstName,
  		      lastName : user.lastName,
  		      gender : user.gender,
  		      dateOfBirth : user.dateOfBirth
  		    });
          this.navCtrl.setRoot(DoctorMenuPage, user);
  		})
  		.catch(error=>{
        	console.log('Registration error : ', error.message);
  			this.showAlert('Error', error.message);
  		})
  	}
  	else{
		this.showAlert('Error', 'Both passwords do not match!');
  	}
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorRegisterPage');
  }

}
