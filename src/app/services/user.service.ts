import { Injectable } from "@angular/core";
import { User } from '../models/user.model';
import * as firebase from "firebase/app"
import "firebase/firestore"

@Injectable()
export class UserService{

    table : string = "users"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)

    findAll(company_id : string) : Promise<User[]>{
        const result : User[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("company_id","==",company_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new User()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findOneById(id : string) : Promise<User>{
        const response : User = new User()
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach(data => {
                    console.log(data)
                    response.set(data)
                    console.log(response)
                })
                resolve(response)
            })
            .catch(err => reject(err))
        })        
    }

    save(e : User){
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).set(e.get())
            .then(() => {
                resolve(e)
            })
            .catch(err => reject(err)) 
        })        
    }

    remove(e : User){
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }

}