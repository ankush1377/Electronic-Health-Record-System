import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the UploadedRecordsModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'uploaded-records-modal',
  templateUrl: 'uploaded-records-modal.html'
})
export class UploadedRecordsModalComponent {

  recordsData: any = [];

  constructor(private params: NavParams, private iab: InAppBrowser) {
    console.log('Hello UploadedRecordsModalComponent Component');
    this.recordsData = params.data;
  }

  fetchReport(recordUrl){
  	return this.iab.create(recordUrl);
  }
}
