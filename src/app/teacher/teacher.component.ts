import { Component, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MTservice } from '../mt-services';


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {

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
