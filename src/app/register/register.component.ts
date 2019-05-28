import { Component, OnInit } from '@angular/core';
import { MTservice } from '../mt-services';
import { MTvalidators } from '../mt-validators';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
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
      password: new FormControl('',[
          Validators.required,
        ]),
      cpassword: new FormControl('',[
          Validators.required,
          this.passCompare
        ]),
    });

    this.sendOtpForm = new FormGroup({
      contact: new FormControl('',{
        validators: [
           Validators.required
       ],
       asyncValidators: [
           this.sendOtp.bind(this)
       ],
       updateOn: 'submit'
     })
   });

   this.verifyOtpForm = new FormGroup({
       contact: new FormControl(''),
       otp: new FormControl('',{
         validators: [
           Validators.required
       ],
       asyncValidators: [
           this.verifyOtp.bind(this)
       ],
       updateOn: 'submit'
     })
   });

   this.resetForm = new FormGroup({
       contact: new FormControl(''),
       password: new FormControl('',[
           Validators.required
       ]),
       cpassword: new FormControl('',[
           Validators.required
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
    logData.append('env', this.data.env);

    var apiurl = this.mtServ.apiLink+'account/register'; 
      this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['status'] == 200){
          this.data.newRegUi = false;
          this.data.newRegVerifyUi = true;
        }
        else{
          this.data.success = false;
        }
      });
}

public sendOtp = (data) => {
  this.data.loader = true;

    var frmData = JSON.stringify({'contact':data.value});
    const logData = new FormData();
    logData.append('data', btoa(frmData));
    logData.append('action', 'sendcode');
    logData.append('env', this.data.env);

    var apiurl = this.mtServ.apiLink+'account/forgot-password'; 
      return this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['status'] == 200){
          this.data.sendOtpUi = false;
          this.data.verifyUi = true;
          this.data.resetUi = false;
          this.verifyOtpForm.controls['contact'].setValue(this.sendOtpForm.controls.contact.value);
        }
        else{
            return {'wrongContact':true}; 
        }
      });
}

public resendOtp(contact){

  this.data.loader = true;
  var frmData = JSON.stringify({'contact':contact});
    const logData = new FormData();
    logData.append('data', btoa(frmData));
    logData.append('action', 'sendcode');
    logData.append('env', this.data.env);

    var apiurl = this.mtServ.apiLink+'account/forgot-password'; 
      this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['status'] == 200){
          this.data.message = 'OTP Sent';
        }
        else{
          this.data.message = 'Error';
        }
      });
}

public verifyOtp = (data) => {
    if(this.data.newRegVerifyUi){
       this.data.loader = true;
       var apiurl = this.mtServ.apiLink+'account/verify';
     }
     else{
       this.data.loader = true;
       var apiurl = this.mtServ.apiLink+'account/forgot-password';
     }
     //console.log(data.value);
     let contact = (this.sendOtpForm.controls.contact.value) ? this.sendOtpForm.controls.contact.value : this.registerForm.controls.contact.value;
    //console.log(email);
    var frmData = JSON.stringify({'contact':contact, 'otp':data.value});
    const logData = new FormData();
    logData.append('data', btoa(frmData));
    logData.append('action', 'verifyCode');
    logData.append('env', this.data.env);

     
      return this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        this.data.loader = false;
        
        if(data['verify']){
          if(this.data.newRegVerifyUi){
            this.data.newRegVerifyUi = false;
            this.data.success = true;
          }
          else{
            this.data.sendOtpUi = false;
            this.data.verifyUi = false;
            this.data.resetUi = true;
            this.resetForm.controls['contact'].setValue(this.sendOtpForm.controls.contact.value);
          }
        }
        else{
          return {'wrongOtp':true}; 
        }
      });
}

public resetPassword(data){
    this.data.loader = true;

    var frmData = JSON.stringify(data);
    const logData = new FormData();
    logData.append('data', btoa(frmData));
    logData.append('action', 'resetPassword');
    logData.append('env', this.data.env);

    var apiurl = this.mtServ.apiLink+'account/forgot-password'; 
      this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['reset']){
          this.data.sendOtpUi = false;
          this.data.verifyUi = false;
          this.data.resetUi = false;
          this.data.resetSuccess = true;
        }
        else{
          
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
