var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the UploadedRecordsModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var UploadedRecordsModalComponent = /** @class */ (function () {
    function UploadedRecordsModalComponent(params, iab) {
        this.params = params;
        this.iab = iab;
        this.recordsData = [];
        console.log('Hello UploadedRecordsModalComponent Component');
        this.recordsData = params.data.filesUploaded.records;
    }
    UploadedRecordsModalComponent.prototype.fetchReport = function (recordUrl) {
        return this.iab.create(recordUrl);
    };
    UploadedRecordsModalComponent = __decorate([
        Component({
            selector: 'uploaded-records-modal',
            templateUrl: 'uploaded-records-modal.html'
        }),
        __metadata("design:paramtypes", [NavParams, InAppBrowser])
    ], UploadedRecordsModalComponent);
    return UploadedRecordsModalComponent;
}());
export { UploadedRecordsModalComponent };
//# sourceMappingURL=uploaded-records-modal.js.map