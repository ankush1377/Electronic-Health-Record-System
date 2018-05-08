import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import firebase from 'firebase';

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

@Component({
  templateUrl: 'patient-tabs.html'
})
export class PatientTabsPage {

  userData: Object;
  tab1Root = PatientPrescriptionsTabPage;
  tab2Root = PatientRecordTabPage;
  tab3Root = PatientProfileTabPage;
  tab4Root = PatientDiseasePredictorTabPage;
  tab5Root = PatientAppointmentsTabPage;

  constructor(public navParams: NavParams) {
  	this.userData = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientTabsPage');
  }

}
