import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientSetupPage } from './patient-setup';

@NgModule({
  declarations: [
    PatientSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientSetupPage),
  ],
})
export class PatientSetupPageModule {}
