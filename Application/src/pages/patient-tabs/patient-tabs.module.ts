import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientTabsPage } from './patient-tabs';

@NgModule({
  declarations: [
    PatientTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientTabsPage),
  ],
})
export class PatientTabsPageModule {}
