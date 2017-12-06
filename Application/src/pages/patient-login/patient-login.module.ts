import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientLoginPage } from './patient-login';

@NgModule({
  declarations: [
    PatientLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientLoginPage),
  ],
})
export class PatientLoginPageModule {}
