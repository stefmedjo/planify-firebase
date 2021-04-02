import { Company } from './company.model';
import { Task } from './task.model';

export class User{
    id : string
    fname : string
    lname : string
    phone : string
    company_id : string

    company : Company = null
    tasks : Task[] = []


    constructor(){
        this.id = null
        this.fname = ""
        this.lname = ""
        this.phone = ""
        this.company_id = null
    }

    set(data){
        this.id = data.id
        this.fname = data.data().fname
        this.lname = data.data().lname
        this.phone = data.data().phone
        this.company_id = data.data().company_id
    }

    get(){
       return {
           id : this.id,
           fname : this.fname,
           lname : this.lname,
           phone : this.phone,
           company_id : this.company_id
       } 
    }

    isValid(){
        const response = { success : false, message:"" }
        if([null,undefined,""].includes(this.fname)){
            response.message = "Vous devez fournir un prénom"
        }else if([null,undefined,""].includes(this.lname)){
            response.message = "Vous devez fournir un nom"
        }else if([null,undefined,""].includes(this.company_id)){
            response.message = "Vous devez choisir une entreprise"
        }
        return response
    }
    name(){
        return this.fname + " " + this.lname
    }

}