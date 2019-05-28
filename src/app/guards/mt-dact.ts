import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { MTservice } from '../mt-services';


@Injectable()

export class NotLogged{

	constructor(public mtServ: MTservice, public router: Router){
		this.mtServ = mtServ;
	}
	canActivate(){
		return this.mtServ.MtGetPromise('account/status').then(data => {
			
        	var logdata = JSON.parse(data['_body']);
        	if(logdata['login']){
    			if(logdata['data']['role'] == '1'){
                    this.router.navigate(['/superadmin']);
                }
                else if(logdata['data']['role'] == '2'){
                    this.router.navigate(['/admin']);
				}
				else if(logdata['data']['role'] == '3'){
                    this.router.navigate(['/teacher']);
				}
				else if(logdata['data']['role'] == '4'){
                    this.router.navigate(['/student']);
				}
				else if(logdata['data']['role'] == '5'){
                    this.router.navigate(['/parent']);
                }
    			
    			return false;
    		}
    		else{   
    			return true; 
    		}		
    	});
	}
}