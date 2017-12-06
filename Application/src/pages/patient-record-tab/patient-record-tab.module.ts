import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientRecordTabPage } from './patient-record-tab';

@NgModule({
  declarations: [
    PatientRecordTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientRecordTabPage),
  ],
})
export class PatientRecordTabPageModule {}
