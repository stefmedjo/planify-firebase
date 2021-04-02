export class Member{
    id : string
    project_id : string
    user_id : string
    role : string
    company_id : string

    constructor(){}

    set(data){
        this.id = data.id
        this.project_id = data.data().project_id
        this.user_id = data.data().user_id
        this.role = data.data().role
        this.company_id = data.data().company_id
    }

    get(){
        return {
            id : this.id,
            project_id : this.project_id,
            user_id : this.user_id,
            role : this.role,
            company_id : this.company_id
        }
    }

    isValid(){
        const response = { success : false, message : "" }
        if([null,undefined,""].includes(this.project_id)){
            response.message = "Vous devez choisir un projet"
        }else if([null,undefined,""].includes(this.user_id)){
            response.message = "Vous devez choisir un utilisateur"
        }else if([null,undefined,""].includes(this.company_id)){
            response.message = "Vous devez choisir une entreprise"
        }else{
            response.success = true
        }
        return response
    }

}