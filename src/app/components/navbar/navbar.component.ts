import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase/app"
import "firebase/auth"
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';


@Component({
    selector : "app-navbar",
    templateUrl : "./navbar.component.html"
})

export class NavbarComponent implements OnInit{

    isConnected : boolean = false
    isLoading : boolean = true

    constructor(private router : Router){}

    ngOnInit(){
        firebase.auth().onAuthStateChanged((data) => {
            if(data != null){
                this.isConnected = true
            }
            this.isLoading = false
            console.log(this.isConnected)
        })
    }

    logout(){
        firebase.auth().signOut()
        .then(() => {
            this.router.navigate(["login"])
        })
    }
}