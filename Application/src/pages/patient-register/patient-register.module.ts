import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientRegisterPage } from './patient-register';

@NgModule({
  declarations: [
    PatientRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientRegisterPage),
  ],
})
export class PatientRegisterPageModule {}
