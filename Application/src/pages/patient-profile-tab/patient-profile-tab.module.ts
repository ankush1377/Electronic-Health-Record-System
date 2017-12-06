import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientProfileTabPage } from './patient-profile-tab';

@NgModule({
  declarations: [
    PatientProfileTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientProfileTabPage),
  ],
})
export class PatientProfileTabPageModule {}
