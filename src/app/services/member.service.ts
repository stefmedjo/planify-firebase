import { Injectable } from "@angular/core";
import { Member } from '../models/member.model';
import * as firebase from "firebase/app"
import "firebase/firestore"

@Injectable()
export class MemberService {

    table : string = "members"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)

    findAll(company_id : string) : Promise<Member[]>{
        const result : Member[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("company_id","==",company_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const member = new Member()
                    member.set(data)
                    result.push(member)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findOneById(id : string) : Promise<Member>{
        const response : Member = null
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                response.set(datas[0])
                resolve(response)
            })
            .catch(err => reject(err))
        })        
    }

    save(e : Member) : Promise<Member>{
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

    remove(e : Member) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }

}