import { Company } from './company.model';
import { Project } from './project.model';
import { User } from './user.model';

export class Task{
    id : string
    start_date : string
    end_date : string
    text : string
    progress : number
    duration : number
    parent : number
    project_id : string
    managed_by : string
    company_id : string
    created_on : Date = new Date()

    is_late : boolean = false
    project : Project = null
    company : Company = null
    manager : User = null

    constructor(){
        this.id = null
        this.start_date = ""
        this.end_date = ""
        this.text = ""
        this.progress = 0
        this.duration = 0
        this.parent = null
        this.project_id = null
        this.company_id = null
        this.managed_by = null
        this.created_on = new Date()
    }

    set(data){
        this.id = data.id
        this.start_date = data.data().start_date
        this.end_date = data.data().end_date
        this.text = data.data().text
        this.progress = data.data().progress
        this.parent = data.data().parent
        this.project_id = data.data().project_id
        this.company_id = data.data().company_id
        this.managed_by = data.data().managed_by
    }

    get(){
        return {
            id:this.id,
            start_date : this.start_date,
            end_date : this.end_date,
            text : this.text,
            progress : this.progress,
            parent : this.parent,
            project_id : this.project_id,
            company_id : this.company_id,
            managed_by : this.managed_by,
            created_on : this.created_on
        }
    }

    isValid(){
        const response = { success : false, message : "" }
        if([undefined,null,""].includes(this.start_date)){
            response.message = "Vous devez préciser une date de début."
        }else if([undefined,null,""].includes(this.end_date)){
            response.message = "Vous devez préciser une date de fin."
        }else if([undefined,null,""].includes(this.project_id)){
            response.message = "Vous devez choisir un projet."
        }else if([undefined,null,""].includes(this.company_id)){
            response.message = "Vous devez préciser une entreprise."
        }else if([undefined,null,""].includes(this.managed_by)){
            response.message = "Vous devez préciser un responsable."
        }else if(this.start_date > this.end_date || this.start_date == this.end_date){
            response.message = "La date de début doit être antérieure à la date de fin."
        }
        else{
            response.success = true
        }
        return response
    }

}