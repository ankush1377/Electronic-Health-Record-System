import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

	apiUrl = '../app';

	constructor(public http: HttpClient) {
    	console.log('Hello RestProvider Provider');
  	}


  	getPredictedDisease() {
	  	return new Promise(resolve => {
	    	this.http.get(this.apiUrl+'/getPredictedDisease').subscribe(
	    	data => resolve(data)
	    	, err => {
	      		console.log(err);
	    	});
	  	});
	}


	sendSelectedSymptoms(data) {
	  return new Promise((resolve, reject) => {
	    this.http.post(this.apiUrl, data)
	      .subscribe(res => {
	        resolve(res);
	      }, (err) => {
	        reject(err);
	      });
	  });
	}

}
