export class Company{
    id : string
    name : string

    constructor(){
        this.id = null
        this.name = ""
    }

    set(data){
        this.id = data.id
        this.name = data.data().name
    }

    get(){
        return {
            id : this.id,
            name : this.name
        }
    }

    isValid(){
        const result = { success : false, message : "" }
        if([null,undefined,""].includes(this.name)){
            result.message = "Vous devez fournir un nom."
        }else{
            result.success = true
        }
        return result
    }
}