import { Injectable } from "@angular/core";
import { Task } from '../models/task.model';
import * as firebase from "firebase/app"
import "firebase/firestore"


@Injectable()
export class TaskService {
    
    table : string = "tasks"
    collection : firebase.firestore.CollectionReference = firebase.firestore().collection(this.table)
    
    get(): Promise<Task[]>{

        let task1 = new Task()
        task1.id = "1"
        task1.text = "Tâche 1"
        task1.start_date = "2017-04-15 00:00"
        task1.duration = 3
        task1.progress = 0.6

        let task2 = new Task()
        task2.id = "2"
        task2.text = "Tâche 2"
        task2.start_date = "2017-04-18 00:00"
        task2.duration = 3
        task2.progress = 0.4

        const tasks = []
        tasks.push(task1)
        tasks.push(task2)

        return Promise.resolve(tasks);
    }

    findRealtimeTasks(project_id : string){
        return this.collection
    }

    findAll(company_id : string) : Promise<Task[]>{
        const result : Task[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("company_id","==",company_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new Task()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findByProject(project_id : string) : Promise<Task[]>{
        const result : Task[] = []
        return new Promise((resolve, reject) => {
            this.collection.where("project_id","==",project_id).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                datas.forEach((data : firebase.firestore.QueryDocumentSnapshot) => {
                    const e = new Task()
                    e.set(data)
                    result.push(e)
                })
                resolve(result)
            })
            .catch(err => reject(err))
        })        
    }

    findOneById(id : string) : Promise<Task>{
        const response : Task = null
        return new Promise((resolve, reject) => {
            this.collection.where("id","==",id).limit(1).get()
            .then((datas : firebase.firestore.QuerySnapshot) => {
                response.set(datas[0])
                resolve(response)
            })
            .catch(err => reject(err))
        })        
    }

    save(e : Task){
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

    remove(e : Task){
        return new Promise((resolve, reject) => {
            this.collection.doc(e.id).delete()
            .then(() => {
                resolve(true)
            })
            .catch(err => reject(err))
        })        
    }
}