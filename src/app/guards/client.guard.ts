import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { MTservice } from '../mt-services';

@Injectable()

export class ClientGuard{

	constructor(public mtServ: MTservice, public router: Router){
		this.mtServ = mtServ;
	}
	canActivate(){

        return this.mtServ.MtGetPromise('account/status').then(data => {
            
            var logdata = JSON.parse(data['_body']);
            if(logdata['login'] && logdata['data']['role'] == '2'){
                sessionStorage.setItem('name',logdata['data']['fName']);
                sessionStorage.setItem('dp',logdata['data']['userImg']);
                sessionStorage.setItem('role',logdata['data']['role']);
                sessionStorage.setItem('id',logdata['data']['userId']);
                return true;
            }
            else{   
            this.router.navigate(['/login']);
            return false; 
            }
        });
	}
}
