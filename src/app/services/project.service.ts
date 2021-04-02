import { Injectable } from "@angular/core";
import { Project } from '../models/project.model';
import * as firebase from "firebase/app"
import "firebase/firestore"

@Injectable()
export class ProjectService{

    table : string = "projects"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)

    findAll(company_id : string) : Promise<Project[]>{
        const result : Project[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("company_id","==",company_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new Project()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findOneById(id : string) : Promise<Project>{
        let response : Project = null
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach(data => {
                    response = new Project()
                    response.set(data)
                })
                resolve(response)                
            })
            .catch(err => reject(err))
        })        
    }

    save(e : Project) : Promise<Project>{
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

    remove(e : Project) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }

}