import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { config } from 'src/app/config/app.config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading : boolean = false

  form : FormGroup
  error : { show : boolean, message : string } = { show : false, message : ""}

  constructor(
    private builder : FormBuilder,
    private auth : AuthService,
    private companyService : CompanyService,
    private userService : UserService,
    private router : Router,
    private titleService : Title
  ) { 
    this.form = this.builder.group({
      fname : [''],
      lname : [''],
      email : ['',Validators.required],
      password : ['',Validators.required],
      password2 : ['',Validators.required],
      company : ['']
    })
  }

  ngOnInit() {
    this.titleService.setTitle("Get Started with Planify - " + config.app_name)
  }

  submit(){
    this.isLoading = true
    const email = this.form.value.email
    const password = this.form.value.password
    const password2 = this.form.value.password2
    const company = this.form.value.company
    const fname = this.form.value.fname
    const lname = this.form.value.lname
    if([null,undefined,""].includes(email)){
      this.error.show = true
      this.error.message = "You need to provide an email address."
      this.isLoading = false
    }else if([null,undefined,""].includes(password)){
      this.error.show = true
      this.error.message = "You need to provide a password."
      this.isLoading = false
    }else if([null,undefined,""].includes(password2)){
      this.error.show = true
      this.error.message = "You need to confirm your password."
      this.isLoading = false
    }else if([null,undefined,""].includes(company)){
      this.error.show = true
      this.error.message = "You need to provide your company's name."
      this.isLoading = false
    }else if(password != password2){
      this.error.show = true
      this.error.message = "The passwords you submitted are different."
      this.isLoading = false
    }else{
      let user = new User()
      user.fname = fname
      user.lname = lname
      this.auth.register(user,email,password)
      .then((data : User)=> {
        user = data
        console.log("Compte créé---")
        console.log(user)
        this.auth.login(email,password)
        .then(() => {
          console.log("Connecté---")
          let _company = new Company()
          _company.name = company
          this.companyService.save(_company)
          .then((data : Company) => {
            _company = data
            user.company_id = _company.id
            this.userService.save(user)
            .then(() => {
              this.router.navigate(['/'])
            })
          })
        })
      })
      .catch(err => {
        this.error.message = err.message
        this.error.show = true
        this.isLoading = false
      })
    }
  }

  init(){
    this.error.message = ""
    this.error.show = false
  }

}
