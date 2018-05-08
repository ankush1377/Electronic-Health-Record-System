var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import * as constants from '../../constants';
/*
  Generated class for the UtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var UtilityProvider = /** @class */ (function () {
    function UtilityProvider(alertCtrl, afAuth) {
        this.alertCtrl = alertCtrl;
        this.afAuth = afAuth;
        console.log('Hello UtilityProvider Provider');
    }
    UtilityProvider.prototype.showAlert = function (title, subtitle) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: ['OK']
        });
        alert.present();
    };
    UtilityProvider.prototype.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    UtilityProvider.prototype.calculateAge = function (birthday) {
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    UtilityProvider.prototype.checkUidValidity = function (uid, profileType) {
        if (uid && profileType) {
            var uidCheckPromise = new Promise(function (resolve, reject) {
                var database = firebase.database();
                var notificationsRef = database.ref(constants.DB_CREDENTIALS + '/' + profileType + '/' + uid);
                notificationsRef.on('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            });
            uidCheckPromise.then(function (data) {
                if (data)
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
    };
    UtilityProvider.prototype.logoutUser = function (afAuth, appCtrl, page) {
        console.log('Logging out');
        afAuth.auth.signOut;
        appCtrl.getRootNav().setRoot(page);
    };
    UtilityProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertController, AngularFireAuth])
    ], UtilityProvider);
    return UtilityProvider;
}());
export { UtilityProvider };
//# sourceMappingURL=utility.js.map