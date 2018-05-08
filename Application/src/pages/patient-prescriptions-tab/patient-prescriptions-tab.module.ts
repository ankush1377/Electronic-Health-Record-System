import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientPrescriptionsTabPage } from './patient-prescriptions-tab';

@NgModule({
  declarations: [
    PatientPrescriptionsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientPrescriptionsTabPage),
  ],
})
export class PatientPrescriptionsTabPageModule {}
