export class Link{
    id : string
    source : number
    target : number
    type : string
    project_id : string
    company_id : string

    constructor(){}

    set(data){
        this.id = data.id
        this.source = data.data().source
        this.target = data.data().target
        this.type = data.data().type
        this.project_id = data.data().project_id
        this.company_id = data.data().company_id
    }

    get(){
        return {
            id : this.id,
            source : this.source,
            target : this.target,
            type : this.type,
            project_id : this.project_id,
            company_id : this.company_id
        }
    }

    isValid(){
        const response = { success : false, message : ""}
        if([undefined,null].includes(this.source)){
            response.message = "Vous devez fournir une tâche source."
        }else if([undefined,null].includes(this.target)){
            response.message = "Vous devez fournir une tâche cible."
        }else if([undefined,null,""].includes(this.type)){
            response.message = "Vous devez fournir un type."
        }else if([undefined,null,""].includes(this.project_id)){
            response.message = "Vous devez choisir un projet."
        }else if([undefined,null,""].includes(this.company_id)){
            response.message = "Vous devez fournir une entreprise."
        }else{
            response.success = true
        }
        return response
    }
}