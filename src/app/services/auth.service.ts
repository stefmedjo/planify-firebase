import { Injectable } from "@angular/core";
import * as firebase from "firebase/app"
import "firebase/auth"
import { User } from '../models/user.model';

@Injectable()
export class AuthService{



    login(email : string, password : string){
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email,password)
            .then((data) => {
                resolve(data)
            })
            .catch(err => { reject(err) })
        })        
    } 

    register(user : User, email : string,password : string) : Promise<User>{
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email,password)
            .then((data : firebase.auth.UserCredential) => {
                user.id = data.user.uid
                resolve(user)
            })
            .catch(err => { reject(err) })
        })        
    }

}