import { Component, OnInit } from '@angular/core';
import { MTservice } from '../mt-services';
import { MTvalidators } from '../mt-validators';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Router, ActivatedRoute, Params} from "@angular/router";

export class MtStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  matcher = new MtStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  data:any ={};
  logInForm;
  constructor(public mtServ: MTservice, public router: Router, public valider: MTvalidators,  private activatedRoute: ActivatedRoute) {
    this.mtServ = mtServ;
    this.valider = valider;

    this.data.loader = false;

    this.logInForm = new FormGroup({
      username: new FormControl('',[
            Validators.required
        ]),
      password: new FormControl('',{
        validators: [
            Validators.required
        ],
        asyncValidators: [
            this.logIn.bind(this)
        ],  
        updateOn: 'submit'
      })
    });
  }

  ngOnInit() {
  }

  public logIn = (password) => {
    this.data.loader = true;
    var frmData = JSON.stringify({'username':this.logInForm.controls['username'].value,'password':password.value});
    const logData = new FormData();
    logData.append('data', btoa(frmData));

    var apiurl = this.mtServ.apiLink+'account/login'; 
      return this.mtServ.MtPost(apiurl,logData,'').then(data => {
        this.data.loader = false;
        
        if(data['login'] && data['is_active']){
          if(data['role'] == '1'){
            this.router.navigate(['/superadmin']);
          }
          else if(data['role'] == '2'){
            this.router.navigate(['/admin']);
          }
          else if(data['role'] == '3'){
            this.router.navigate(['/teacher']);
          }
          else if(data['role'] == '4'){
            this.router.navigate(['/student']);
          }
          else if(data['role'] == '5'){
            this.router.navigate(['/parent']);
          }
        }
        else if(data['login'] && !data['is_active']){
          this.router.navigate(['account/register/verify'],{queryParams : {'e' : btoa(data['email']), 'env':this.data.env}});
        }
        else{
          return {'wrongPass':true};
        }
      });

}


}
