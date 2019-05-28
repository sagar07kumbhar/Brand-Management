import { Component, OnInit, ViewChild } from '@angular/core';
import { MTservice } from '../../mt-services';
import { MTvalidators } from '../../mt-validators';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

export class MtStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @ViewChild('selectedFile') selectedFileEl;

  matcher = new MtStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  data:any ={};
  registerForm;
  sendOtpForm;
  verifyOtpForm;
  resetForm;

  constructor(public mtServ: MTservice, public router: Router, public valider: MTvalidators,  private activatedRoute: ActivatedRoute) {
    this.mtServ = mtServ;
    this.valider = valider;

    this.data.loader = false;
    this.data.success = false;
    this.data.resetSuccess = false;
    this.data.forgotPass = false;
    this.data.forgotPassloader = false;
    this.data.sendOtpUi = true;
    this.data.verifyUi = false;
    this.data.resetUi = false;
    this.data.newRegUi = true;
    this.data.newRegVerifyUi = false;
    this.data.message = '';


    this.registerForm = new FormGroup({
      fname: new FormControl('',[
          Validators.required,
          this.valider.validAlphaOnly
        ]),
      lname: new FormControl('',[
          Validators.required,
          this.valider.validAlphaOnly
        ]),
      email: new FormControl('',[
          Validators.required,
          Validators.email            
        ],
        [this.if_exist_email.bind(this)]),
      contact: new FormControl('',[
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          this.valider.validateMobile
        ],
        [this.if_exist_contact.bind(this)]),
      address: new FormControl('',[
        Validators.required,
      ]),
      city: new FormControl(''),
      state: new FormControl(''),
      pin: new FormControl(''),
      country: new FormControl(''),
      password: new FormControl('',[
          Validators.required,
        ]),
      cpassword: new FormControl('',[
          Validators.required,
          this.passCompare
        ]),
    });

   }

  ngOnInit() {
  }

  public passCompare = (control) => {
    //console.log($('#password').val());
    //console.log(control);
    //alert($('#password').val());
    
      if($('#password').val() != $('#cpassword').val()){
        return {'passwordCompare':true};
      }

  }
    
  public registerUser(data){
  	  
    this.data.loader = true;

    var frmData = JSON.stringify(data);
    const logData = new FormData();
    logData.append('data', btoa(frmData));
    logData.append('file', this.selectedFileEl.nativeElement.files[0]);

    var apiurl = this.mtServ.apiLink+'account/adduser'; 
      this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['status'] == 200){
          $('.resetBtn').click();
          this.mtServ.triggerSnack('Admin Added Sucessfully',null,'center');
        }
        else{
          this.mtServ.triggerSnack('Something went wrong');
        }
      });
}

public if_exist_email = (control) => {
//console.log(env);
  var frmData = JSON.stringify({'email':control.value});
  const mailData = new FormData();
  mailData.append('data', btoa(frmData));
  mailData.append('env', this.data.env);

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
  mailData.append('env', this.data.env);

  var apiurl = this.mtServ.apiLink+'account/checkfield';
   return this.mtServ.MtPostPromise(apiurl,mailData,'').then(data => {
        var resdata = JSON.parse(data['_body']);
        if(resdata['field']){
          return {'exist':true};
        }
    });
}

}
