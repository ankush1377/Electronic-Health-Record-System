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
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var RestProvider = /** @class */ (function () {
    function RestProvider(http) {
        this.http = http;
        this.apiUrl = '../app';
        console.log('Hello RestProvider Provider');
    }
    RestProvider.prototype.getPredictedDisease = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.apiUrl + '/getPredictedDisease').subscribe(function (data) { return resolve(data); }, function (err) {
                console.log(err);
            });
        });
    };
    RestProvider.prototype.sendSelectedSymptoms = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.apiUrl, data)
                .subscribe(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    RestProvider.prototype.getHospitalData = function (state) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get('https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d?format=json&api-key=579b464db66ec23bdd000001c4fb377fcdef4f187dcc0df4132d9e0a&filters[state]=' + state + '&fields=hospital_name&limit=40000&sort[hospital_name]=asc').subscribe(function (data) {
                resolve(data);
            }, function (err) {
                console.log(err);
            });
        });
    };
    RestProvider.prototype.getDispensaryData = function (state) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get('https://api.data.gov.in/resource/0578a6c3-056e-4182-af7a-4307f1e0c2a7?format=json&api-key=579b464db66ec23bdd000001c4fb377fcdef4f187dcc0df4132d9e0a&filters[state]=' + state + '&fields=hospitalname&limit=10000&sort[hospitalname]=asc').subscribe(function (data) {
                resolve(data);
            }, function (err) {
                console.log(err);
            });
        });
    };
    RestProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], RestProvider);
    return RestProvider;
}());
export { RestProvider };
//# sourceMappingURL=rest.js.map