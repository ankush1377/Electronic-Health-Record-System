import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientHomePage } from './patient-home';

@NgModule({
  declarations: [
    PatientHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PatientHomePage),
  ],
})
export class PatientHomePageModule {}
