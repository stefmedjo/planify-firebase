import { Injectable } from "@angular/core";
import { Company } from '../models/company.model';
import * as firebase from "firebase/app"
import "firebase/firestore"

@Injectable()
export class CompanyService{

    table : string = "companies"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)

    findAll() : Promise<Company[]>{
        const result : Company[] = []
        return new Promise((resolve, reject) => {
            this.collection.get().then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const company = new Company()
                    company.set(data)
                    result.push(company)
                })
                resolve(result)
            })
            .catch(err => reject(err))            
        })        
    }

    findOneById(id : string) : Promise<Company>{
        const response : Company = null
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get().then((data : firebase.firestore.QuerySnapshot) => {
                response.set(data[0])
                resolve(response)
            })
            .catch(err => reject(err))
        })        
    }

    save(e : Company) : Promise<Company>{
        return new Promise((resolve, reject) => {
            if([null,undefined,""].includes(e.id)){
                e.id = this.collection.doc().id
            }
            this.collection.doc(e.id).set(e.get())
            .then(() => {
                resolve(e)
            })
            .catch(err => reject(err))
        })        
    }

    remove(e : Company) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }

}