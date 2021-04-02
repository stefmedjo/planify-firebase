import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase"
import "firebase/auth"
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { config } from 'src/app/config/app.config';

@Component({
    selector : "app-home",
    templateUrl : "./home.component.html"
})
export class HomeComponent implements OnInit{

    isLoading : boolean = true
    cuser : User = null

    constructor(
        private userService : UserService,
        private authService : AuthService,
        private titleService : Title
    ){}
    
    ngOnInit(){
        firebase.auth().onAuthStateChanged((data : firebase.User) => {
            if(data != null){
                console.log(data.uid)
                this.userService.findOneById(data.uid)
                .then((data : User) => {
                    this.titleService.setTitle("Dashboard - " + config.app_name)
                    this.cuser = data
                    this.isLoading = false

                })
                .catch(err => {
                    this.isLoading = false
                    this.handleErrors(err.message)
                })
            }else{
                this.isLoading = false
                this.titleService.setTitle("Online Gantt Chart Builder | Planify")
            }
        })
    }

    handleErrors(txt : string){
        console.log(txt)
    }

}