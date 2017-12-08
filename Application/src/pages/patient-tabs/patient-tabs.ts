import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import firebase from 'firebase';

import { PatientProfileTabPage } from '../patient-profile-tab/patient-profile-tab';
import { PatientRecordTabPage } from '../patient-record-tab/patient-record-tab';
import { PatientDiseasePredictorTabPage } from '../patient-disease-predictor-tab/patient-disease-predictor-tab';

/**
 * Generated class for the PatientTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'patient-tabs.html'
})
export class PatientTabsPage {

  userData: Object;
  tab1Root = PatientRecordTabPage;
  tab2Root = PatientProfileTabPage;
  tab3Root = PatientDiseasePredictorTabPage;

  constructor(public navParams: NavParams) {
  	this.userData = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientTabsPage');
  }

}
