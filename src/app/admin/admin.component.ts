import { Component, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MTservice } from '../mt-services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  options: FormGroup;
 @ViewChild('sidenav') sidenavLeft: MatSidenav;

  constructor(fb: FormBuilder, public mtsr: MTservice) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
    this.mtsr.toggleSidenavLeft.subscribe(() => {
    this.sidenavLeft.toggle();
  });
  }

}
