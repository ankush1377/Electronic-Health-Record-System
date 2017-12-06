import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

	pet;
	doctorName: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.doctorName = this.navParams.get('firstName') + ' ' + this.navParams.get('lastName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMenuPage');
  }

}
