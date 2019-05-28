import { Injectable, ViewChild, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { CanActivate, Router } from '@angular/router';
// import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';

@Injectable({
  providedIn:'root'
})

export class MTservice{
	
	public toggleSidenavLeft: EventEmitter<any> = new EventEmitter();
	public scrollElm: EventEmitter<any> = new EventEmitter();
	public stickyHeader: EventEmitter<any> = new EventEmitter();
	//baseUrl:string = 'http://localhost:4200/';
	baseUrl:string = 'http://mtdev.in/sms/';
  //apiLink:string = 'http://192.168.0.101/schoolman/index.php/api/';
	apiLink:string = 'http://mtdev.in/smsapi/index.php/api/';
	apiKey:string = btoa('smsapi1234');
	data:any = {};
	options:any;
	constructor(public http: Http, public snackBar: MatSnackBar, private router: Router,  public sanitize: DomSanitizer){
	this.http = http;
	this.data.logged;
	
	//this.data.headers = new Headers();

  	//this.data.headers.append('content-type', 'application/x-www-form-urlencoded');
    //this.data.headers.append('Key',btoa('bmltestapi1234'));

    //this.options = new RequestOptions({headers: this.data.headers});
	}

	AuthApp(headers: Headers) {
    	headers.append('Key',btoa('smsapi1234')); 
  	}


  	canActivate() {
  		/*
  		console.log('login',this.is_logged());
    	if(this.is_logged()=='true'){
    		return true;
    	}
    	else{
    		this.router.navigate(['/register']);
    		return false;
    	}
    	*/

    	return this.MtGetPromise('account/status').then(data => {
			
        	var logdata = JSON.parse(data['_body']);
        	if(logdata['login']){
    			sessionStorage.setItem('name',logdata['data']['displayName']);
          sessionStorage.setItem('dp',logdata['data']['userImg']);
					sessionStorage.setItem('id',logdata['data']['userId']);
					sessionStorage.setItem('role',logdata['data']['role']);
    			return true;
    		}
    		else{   
					this.router.navigate(['/account/register', this.getLoggedUser().role]);	
    		return false; 
    		}		
    	});
  		
  	}

  	is_logged(withData = false){
  		return this.MtGetPromise('account/status').then(data => {
			//console.log(JSON.parse(data['_body'])['login']);
        	var logdata = JSON.parse(data['_body']);
        	if(logdata['login']){
            if(withData){
              return logdata;
            }
            else{
        		  return true;
            } 
        	}
        	else{
        		return false;
        	}
		  });
  	}

  	
  	public logOut(){
  		var apiurl = this.apiLink+'account/logout'; 
  		this.MtGet(apiurl,'').then(data => {
    		// console.log(data);
    		if(!data['login']){
    			this.router.navigate(['/login']);
    		}    		
    	});
  	}

	MtGetPromise(link){
  		var apiurl = this.apiLink + link;
  		let headers = new Headers();
    	this.AuthApp(headers);	
  		this.options = new RequestOptions({headers: headers, withCredentials: true});
		return this.http.get(apiurl,this.options).toPromise()
        .then(res => res);
  }

  MtPostPromise(apiLink,pdata,contentType){
    let headers = new Headers();
    this.AuthApp(headers);  
    if(contentType != ''){
      headers.append('content-type', contentType);
    }
    this.options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.post(apiLink,pdata,this.options).toPromise()
    .then(res => res);
  }
	
	MtPost(apiLink,pData,contentType){

	let headers = new Headers();
    this.AuthApp(headers);	
	if(contentType != ''){
		headers.append('content-type', contentType);
	}
	this.options = new RequestOptions({headers: headers, withCredentials: true}); //cred req 

	return new Promise(resolve=>{
		this.http.post(apiLink, pData,this.options)
   		.map(res => res.json())
   		.subscribe(data => {
   				resolve(data);
   			},error => {
				resolve(error);
   			});
   		});
	}

	MtGet(apiLink,contentType){

	let headers = new Headers();
    this.AuthApp(headers);	
	if(contentType != ''){
		headers.append('content-type', contentType);
	}
	this.options = new RequestOptions({headers: headers, withCredentials: true});
		
	return new Promise(resolve=>{
		this.http.get(apiLink, this.options)
   		.map(res => res.json())
   		.subscribe(data => {
   			resolve(data);
   			});
   		});
	}

	MtPlaceLoader(attrClass,dataId,state,bulk,returnData = null){
		if(state){
			if(bulk){
				dataId.forEach(dt=>{
					$('.'+attrClass+dt).html('<i class="fa fa-spinner fa-spin placeloader"></i>');
				});
			}
			else{
				$('.'+attrClass+dataId).html('<i class="fa fa-spinner fa-spin placeloader"></i>');
			}
			
		}
		else{
      if(returnData != null){
        $('.'+attrClass+dataId).html(returnData);
      }
      else{
			  return;
      }
		}
	}

	changeUserState(uid,action,bulk,env){
		this.MtPlaceLoader('status-row-user-',uid,true,bulk);
	    var apiurl = this.apiLink+'account/'+action; 
	  	var id = JSON.stringify({'id': uid,'bulk':bulk,'env':env});
	  	return this.MtPost(apiurl,id,'application/json');
	
	}

	triggerSnack(message,vertical = null, horizotal = null){
		this.snackBar.open(message, '', {
              duration: 3000,
              verticalPosition: vertical,
              horizontalPosition: horizotal
        });
	}

  timestamp_to_date(t){

    var dt = new Date(t*1000);
    var day = dt.getDate();
    var month = dt.getMonth();
    var yr = dt.getFullYear();
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    return day + '-' + month + '-' + yr + ' ' + hr + ':' + m.substr(-2) + ':' + s.substr(-2);  
}

public downloadFile(apiLink,data,fileName,ext){
    let headers = new Headers();
    this.AuthApp(headers);  

    this.options = new RequestOptions({headers: headers, withCredentials: true, responseType: ResponseContentType.Blob});
    
  return new Promise(resolve=>{
    this.http.post(apiLink, data, this.options)
       .map(res => {
        return {
          filename: fileName+'.'+ext,
          data: res.blob()
        };
      })
       .subscribe(data => {
         resolve(data);
         });
       });
}

public getLoggedUser(){
  return {'uid':sessionStorage.getItem('id'),'user':sessionStorage.getItem('name'), 'dp':sessionStorage.getItem('dp'), 'role':sessionStorage.getItem('role')}
}

public timeSlot(offset = null){
  var times = [];

  for(var i=1;i<=24;i++){
    var filterTime = (i.toString().length == 1) ? 0 + i-1 : i-1;
    var abrv = (i <= 12) ? 'am' : 'pm';
    if(i == 1) filterTime = 12;
    if(i > 12 && filterTime != 12) filterTime = filterTime - 12; 
    //for(var j=0;j<2;j++){
      //var timeIntval = (j % 2 == 0)? ':00 ':':30 ';
      times.push({'time':filterTime + ':00 ' + abrv, 'isUsed':false}); 
    //} 
  }

  return times;
  console.log(times);
}

public getEmbadeUrl(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);

	if (match && match[2].length == 11) {
			return match[2];
	} else {
			return 'error';
	}
}

public getYoutubeSafeUrl(ytUrl){
 return	this.sanitize.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.getEmbadeUrl(ytUrl));
}

public getResoureSafeUrl(url){
	return	this.sanitize.bypassSecurityTrustResourceUrl(url);
}

}
