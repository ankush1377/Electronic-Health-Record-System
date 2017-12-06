import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorMenuPage } from './doctor-menu';

@NgModule({
  declarations: [
    DoctorMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorMenuPage),
  ],
})
export class DoctorMenuPageModule {}
