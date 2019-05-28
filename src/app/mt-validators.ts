import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MTservice } from './mt-services';

@Injectable()

export class MTvalidators{

	constructor(public http: Http, public mtServ: MTservice){
	this.mtServ = mtServ;
	this.http = http;
	
	}
	public validateMobile(control){
		var errors = {};
		if(control.value.length < 10 || /\D/.test(control.value)){
			errors['invalid'] = true;
		}

		return errors;
	}

	public validAlphaOnly(control){
		var errors = {};
		if(!/^[a-zA-Z]+$/.test(control.value)){
			errors['invalid'] = true;
		}

		return errors;
	}

  public passwordFilter(control){
    var errors = {};
    let specialChars = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    let nums = /[0-9]/;

    if(control.value.length < 8){
      errors['short'] = true;
    }

    if(!specialChars.test(control.value) || !nums.test(control.value)){
      errors['weak'] = true;
    }

    return errors;
  }

	public if_exist_email = (control) => {
	//console.log(env);
    var frmData = JSON.stringify({'email':control.value});
    const mailData = new FormData();
    mailData.append('data', btoa(frmData));

    var apiurl = this.mtServ.apiLink+'account/checkfield';
     return this.mtServ.MtPostPromise(apiurl,mailData,'').then(data => {
          var resdata = JSON.parse(data['_body']);
          if(resdata['field']){
            return {'exist':true};
          }
      });
  }

  public if_exist_contact = (control) => {
	//console.log('kk')
    var frmData = JSON.stringify({'contact':control.value});
    const mailData = new FormData();
    mailData.append('data', btoa(frmData));

    var apiurl = this.mtServ.apiLink+'account/checkfield';
     return this.mtServ.MtPostPromise(apiurl,mailData,'').then(data => {
          var resdata = JSON.parse(data['_body']);
          if(resdata['field']){
            return {'exist':true};
          }
      });
  }

}