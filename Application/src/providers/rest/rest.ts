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


	getHospitalData(state: string){
		return new Promise(resolve => {
	    	this.http.get('https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d?format=json&api-key=579b464db66ec23bdd000001c4fb377fcdef4f187dcc0df4132d9e0a&filters[state]='+state+'&fields=hospital_name&limit=40000&sort[hospital_name]=asc').subscribe(
	    	data => {
	    		resolve(data)}
	    	, err => {
	      		console.log(err);
	    	});
	  	});
	}


	getDispensaryData(state: string){
		return new Promise(resolve => {
	    	this.http.get('https://api.data.gov.in/resource/0578a6c3-056e-4182-af7a-4307f1e0c2a7?format=json&api-key=579b464db66ec23bdd000001c4fb377fcdef4f187dcc0df4132d9e0a&filters[state]='+state+'&fields=hospitalname&limit=10000&sort[hospitalname]=asc').subscribe(
	    	data => {
	    		resolve(data)}
	    	, err => {
	      		console.log(err);
	    	});
	  	});
	}

}
