import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorRegisterPage } from './doctor-register';

@NgModule({
  declarations: [
    DoctorRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorRegisterPage),
  ],
})
export class DoctorRegisterPageModule {}
