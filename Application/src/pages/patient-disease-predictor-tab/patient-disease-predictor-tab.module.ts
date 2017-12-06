import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientDiseasePredictorTabPage } from './patient-disease-predictor-tab';

@NgModule({
  declarations: [
    PatientDiseasePredictorTabPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientDiseasePredictorTabPage),
  ],
})
export class PatientDiseasePredictorTabPageModule {}
