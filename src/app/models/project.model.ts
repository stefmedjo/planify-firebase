import { Company } from './company.model';
import { Task } from './task.model';

export class Project{
    id : string
    name : string
    descrip : string
    is_closed : boolean
    created_by : string
    managed_by : string
    company_id : string

    company : Company = null
    tasks : Task[] = []


    constructor(){
        this.id = null
        this.name = ""
        this.descrip = ""
        this.is_closed = false
        this.created_by = null
        this.managed_by = null
        this.company_id = null
    }

    set(data){
        this.id = data.id
        this.name = data.data().name
        this.descrip = data.data().descrip
        this.is_closed = data.data().is_closed
        this.created_by = data.data().created_by
        this.managed_by = data.data().managed_by
        this.company_id = data.data().company_id
    }

    get(){
        return {
            id : this.id,
            name : this.name,
            descrip : this.descrip,
            is_closed : this.is_closed,
            created_by : this.created_by,
            managed_by : this.managed_by,
            company_id : this.company_id
        }
    }

    isValid(){
        const result = { success : false, message : ""}
        if([null,undefined,""].includes(this.company_id)){
            result.message = "Vous devez fournir une entreprise."
        }else if([null,undefined,""].includes(this.name)){
            result.message = "Vous devez fournir un nom au projet."
        }else if([null,undefined,""].includes(this.managed_by)){
            result.message = "Vous devez fournir un responsable de projet."
        }else if([null,undefined,""].includes(this.created_by)){
            result.message = "Vous devez fournir un créateur au projet."
        }else{
            result.success = true
        }
        return result
    }
}