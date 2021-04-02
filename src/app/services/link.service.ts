import { Injectable } from '@angular/core';
import { Link } from '../models/link.model';
import * as firebase from "firebase/app"
import "firebase/firestore"

@Injectable()
export class LinkService {

    table : string = "links"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)

    get(): Promise<Link[]> {
        let e : Link[] =[] 
        let a = new Link()
        a.id = "1"
        a.source = 1
        a.target = 2
        a.type = "0"
        e.push(a)
        return Promise.resolve(e);
    }

    

    findAll(company_id : string) : Promise<Link[]>{
        const result : Link[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("company_id","==",company_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new Link()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findByProject(id : string) : Promise<Link[]>{
        const result : Link[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("project_id","==",id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new Link()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findOneById(id : string) : Promise<Link>{
        const response : Link = null
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                response.set(datas[0])
                resolve(response)
            })
            .catch(err => reject(err))
        })        
    }

    save(e : Link){
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

    remove(e : Link){
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }
    removeById(id : string){
        return new Promise((resolve, reject) => {
            this.collection.doc(id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }
}