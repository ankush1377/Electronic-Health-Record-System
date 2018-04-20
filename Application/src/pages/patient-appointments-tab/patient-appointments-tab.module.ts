import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientAppointmentsTabPage } from './patient-appointments-tab';

@NgModule({
  declarations: [
    PatientAppointmentsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientAppointmentsTabPage),
  ],
})
export class PatientAppointmentsTabPageModule {}
