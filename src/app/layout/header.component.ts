import { Component, Output, EventEmitter} from '@angular/core';
import { AppComponent } from '../app.component';
import { MTservice } from '../mt-services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

 
export class AppHeaderComponent {
  title = 'app';
  data:any = {};
  @Output() toggle = new EventEmitter();
  navToggle() {
    console.log('aaa');
    this.toggle.emit(true);
  }

  userRole;
  constructor(public mtsr: MTservice) { 
    this.data.uname = sessionStorage.getItem('name');
    this.data.dp = sessionStorage.getItem('dp');
    this.data.role = sessionStorage.getItem('role');

    if(this.data.role == 1){
      this.userRole = 'Super Admin';
    }
    else if(this.data.role == 2){
      this.userRole = 'Admin';
    }
    else if(this.data.role == 3){
      this.userRole = 'Teacher';
    }
    else if(this.data.role == 4){
      this.userRole = 'Student';
    }
    else if(this.data.role == 5){
      this.userRole = 'Parent';
    }
    else{
      this.userRole = 'Unknown';
    }
    //this.data.env = sessionStorage.getItem('env').substring(4);
  }

  public toggleSidenavLeft() {
  		this.mtsr.toggleSidenavLeft.emit();
	}

  public logout(){
    this.mtsr.logOut();
  }

}
