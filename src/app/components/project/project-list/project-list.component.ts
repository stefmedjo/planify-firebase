import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

declare var $ : any

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  createForm : FormGroup
  deleteForm : FormGroup
  isLoading : boolean = true
  items : Project[] = []
  projects : Project[] = []
  users : User[] = []
  cuser : User = null

  constructor(
    private projectService : ProjectService,
    private userService : UserService,
    private builder : FormBuilder,
  ) { 
    this.createForm = this.builder.group({
      id : [''],
      name : [''],
      descrip : [''],
      is_closed : [''],
      managed_by : ['']
    })
    this.deleteForm = this.builder.group({
      id : ['']
    })
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((data) => {
      console.log(data)
      if(data != null){
        this.userService.findOneById(data.uid)
        .then((response) => {
          this.cuser = response
          Promise.all([
            this.projectService.findAll(this.cuser.company_id),
            this.userService.findAll(this.cuser.company_id)
          ])
          .then(([_projects,_users] : [Project[],User[]]) => {
            this.projects = _projects
            this.updateItems(this.projects)
            this.users = _users
            this.isLoading = false
          })
        })
        .catch(err => {
          this.isLoading = false
          this.handleErrors(err.message)
        } )
      }
    })
  }

  updateItems(data){
    this.items = data
  }

  showEditForm(e : Project){
    if(e != null){
      $('#edit-project .modal-title').html("Edit Project")
      this.createForm.controls['id'].setValue(e.id)
      this.createForm.controls['name'].setValue(e.name)
      this.createForm.controls['descrip'].setValue(e.descrip)
      this.createForm.controls['is_closed'].setValue(e.is_closed)
      this.createForm.controls['managed_by'].setValue(e.managed_by)
    }else{
      $('#edit-project .modal-title').html("New Project")
      this.createForm.controls['id'].setValue(null)
      this.createForm.controls['managed_by'].setValue(this.users[0].id)
    }
    $('#edit-project').modal('show')
  }

  submitEditForm(){
    $('#edit-project').modal('hide')
    this.isLoading = true
    const project = new Project()
    project.id = this.createForm.value.id
    project.name = this.createForm.value.name
    project.descrip = this.createForm.value.descrip
    project.is_closed = this.createForm.value.is_closed
    project.managed_by = this.createForm.value.managed_by    
    project.created_by = this.cuser.id
    project.company_id = this.cuser.company_id
    
    const isNew = (project.id == null) ? true : false
    const response = project.isValid()
    if(response.success){
      this.projectService.save(project)
      .then((data : Project) => {
        if(isNew){
          this.items.push(data)
        }else{
          for(let i = 0; i < this.items.length; i++){
            if(this.items[i].id == data.id){
              this.items[i] = data
              break
            }
          }
        }
        this.isLoading = false
      })
      .catch(err =>{
        this.isLoading = false
        this.handleErrors(err.message)
      })
    }else{
      this.isLoading = false
      this.handleErrors(response.message)
    }
  }

  showDeleteForm(e : Project){
    if(e == null){
      this.handleErrors("Donnée invalide")
    }
    this.deleteForm.controls['id'].setValue(e.id)
    $('#delete-project').modal('show')
  }

  submitDeleteForm(){
    const project = new Project()
    project.id = this.deleteForm.value.id
    if(![null,undefined,""].includes(project.id)){
      this.projectService.remove(project)
      .then((data) => {
        for(let i = 0; i < this.projects.length; i++) {
          if(this.projects[i].id == project.id){
            this.projects.splice(i,1)
            this.updateItems(this.projects)
            break
          }
        }
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        this.handleErrors(err.message)
      })
    }else{
      this.handleErrors("Une erreur est survenue.")
      this.isLoading = false
    }
  }

  search(text : string){
    if(text.length > 0){
      const datas : Project[] = []
      for(let i = 0; i < this.projects.length; i++) {
        if(this.projects[i].name.includes(text)){
          datas.push(this.projects[i])
        }
      }
      this.updateItems(datas)
    }else{
      this.updateItems(this.projects)
    }
  }

  handleErrors(txt : string){
    alert(txt)
  }

}
