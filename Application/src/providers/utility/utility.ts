import { Injectable } from '@angular/core';
import { AlertController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import * as constants from '../../constants';
/*
  Generated class for the UtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilityProvider {

  constructor( public alertCtrl: AlertController, private afAuth: AngularFireAuth ) {
    console.log('Hello UtilityProvider Provider');
  }


  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }


  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  checkUidValidity(uid, profileType){
    if(uid && profileType){
        
        let uidCheckPromise = new Promise((resolve, reject) => {
          var database = firebase.database();
          var notificationsRef = database.ref(constants.DB_CREDENTIALS + '/' + profileType + '/' + uid);
          notificationsRef.on('value', (snapshot)=>{
            resolve(snapshot.val());
          });
        });

        uidCheckPromise.then( (data)=>{
          if(data)
            return true;
          return false;
        });
      // var database = firebase.database();
      // var reference = database.ref(constants.DB_CREDENTIALS + '/' + profileType + '/' + uid);
      // reference.on("value", (snapshot)=> {
      //   console.log(snapshot.val());
      //   if(snapshot.val())
      //     return true;
      // });
    }
  }


  logoutUser(afAuth: AngularFireAuth, appCtrl: App, page){
    console.log('Logging out');
    afAuth.auth.signOut;
    appCtrl.getRootNav().setRoot(page);
  }

}
