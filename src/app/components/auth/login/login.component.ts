import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error : { show : boolean, message : string } = { show : false, message : ""}
  form : FormGroup
  isLoading : boolean = false

  constructor(
    private builder : FormBuilder,
    private auth : AuthService,
    private router: Router,
    private titleService : Title
  ) { 
    this.form = this.builder.group({
      email : ['',Validators.required],
      password : ['',Validators.required]
    })
  }

  ngOnInit() {
    this.titleService.setTitle("Login to Planify")
  }

  submit(){
    this.isLoading = true
    const email = this.form.value.email
    const password = this.form.value.password
    if([null,undefined,""].includes(email) || [null,undefined,""].includes(password)){
      this.error.show = true
      this.error.message = "Invalid Email or Password."
    }else{
      this.auth.login(email,password)
      .then(() => {
        this.router.navigate(['/'])
      })
      .catch(err => { 
        this.isLoading = false
        this.handleErrors(err.message)
      })
    }
  }

  handleErrors(txt : string){
    console.log(txt)
    this.error.show = true
    this.error.message = "Invalid Email or Password."
  }
}
