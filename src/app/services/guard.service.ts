import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import * as firebase from "firebase"

@Injectable()
export class GuardService implements CanActivate{
    
    constructor(
        private auth : AuthService,
        private router : Router
    ){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.get()
        .then((isAuth) => {
            if(["/login","/register"].includes(state.url)){
                if(isAuth){
                    this.router.navigate(["/"])
                    return false
                }else{
                    return true
                }
            }else{
                if(isAuth){
                    return true
                }else{
                   this.router.navigate(["/login"])
                    return false
                }
            }
        })        
    }

    get(){
        return new Promise((resolve,reject) => {
            firebase.auth()
            .onAuthStateChanged((data) => {
                if(data != null){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
    }
    

}