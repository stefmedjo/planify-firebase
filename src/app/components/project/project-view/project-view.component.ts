import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectService } from 'src/app/services/project.service';
import * as firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"
import { Project } from 'src/app/models/project.model';
import { config } from 'src/app/config/app.config';
import { Task } from 'src/app/models/task.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { DateUtils } from 'src/app/utils/date.utils';
import { LinkService } from 'src/app/services/link.service';
import { Link } from 'src/app/models/link.model';
import { SharedService } from 'src/app/services/shared.service';
defineLocale('fr', frLocale);

declare var $ : any


@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {

  isLoading : boolean = true
  project : Project = new Project()
  createTaskForm : FormGroup
  users : User[] = []
  selectedTask : Task = null


  constructor(
    private ar : ActivatedRoute,
    private router : Router,
    private titleService : Title,
    private projectService : ProjectService,
    private userService : UserService,
    private taskService : TaskService,
    private linkService : LinkService,
    private builder : FormBuilder,
    private localeService : BsLocaleService,
    private sharedService : SharedService
  ) { 
    this.localeService.use("fr")
    this.createTaskForm = this.builder.group({
      start_date : [],
      end_date : [],
      text : [],
      parent : [],
      id : [],
      managed_by : []
    })
    this.sharedService.taskObservable.subscribe((data) => {
      this.selectedTask = data
    })
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((data) => {
      if(data != null){
        const id = this.ar.snapshot.params['id']
        if([null,undefined].includes(id) == false){
          this.projectService.findOneById(id).then((data : Project) => {
            this.project = data
            
            Promise.all([
              this.taskService.findByProject(this.project.id),
              this.userService.findAll(this.project.company_id)
            ])
            .then(([tasks,users] : [Task[],User[]]) => {
              this.project.tasks = tasks
              this.users = users
              this.isLoading = false
            })
            .catch((err) => {
              this.handleErrors(err)
              this.isLoading = false
            })
            this.titleService.setTitle(this.project.name + " - " + config.app_name)
          })
          .catch(err => {
            this.isLoading = false
            this.handleErrors(err)            
          })
        }
      }else{
        this.router.navigate(['login'])
      }
    })
  }

  handleErrors(text : string) : void{
    console.log(text)
  }

  reduce() : void {
    if($("#side").hasClass("opened")){
      $("#side").removeClass("opened")
    }
    $("#side").addClass("reduced")
  }
  open() : void{
    if($("#side").hasClass("reduced")){
      $("#side").removeClass("reduced")
    }
    $("#side").fadeIn(500).addClass("opened")
  }

  editTaskModalShow(task : Task){
    if([null,undefined].includes(task) == false){
      this.createTaskForm.controls['start_date'].setValue(task.start_date)
      this.createTaskForm.controls['end_date'].setValue(task.end_date)
      this.createTaskForm.controls['text'].setValue(task.text)
      this.createTaskForm.controls['parent'].setValue(task.parent),
      this.createTaskForm.controls['id'].setValue(task.id)
      this.createTaskForm.controls['managed_by'].setValue(task.managed_by)
    }else{
      const task = new Task()
      this.createTaskForm.controls['start_date'].setValue("")
      this.createTaskForm.controls['end_date'].setValue("")
      this.createTaskForm.controls['text'].setValue("")
      this.createTaskForm.controls['parent'].setValue(""),
      this.createTaskForm.controls['id'].setValue(null)
      this.createTaskForm.controls['managed_by'].setValue(this.users[0].id)
    }
    $("#edit-task").modal("show")
  }

  submitEditTask(){
    $("#edit-task").modal("hide")
    this.isLoading = true
    const e = new Task()
    e.id = this.createTaskForm.value.id
    e.start_date = this.createTaskForm.value.start_date
    e.end_date = this.createTaskForm.value.end_date
    e.text = this.createTaskForm.value.text
    e.parent = this.createTaskForm.value.parent
    e.project_id = this.project.id
    e.managed_by = this.createTaskForm.value.managed_by
    e.company_id = this.project.company_id

    const isNew = (e.id == null) ? true : false
    const isValid = e.isValid()
    if(isValid.success){
      e.start_date = DateUtils.dateToString(this.createTaskForm.value.start_date)
      e.end_date = DateUtils.dateToString(this.createTaskForm.value.end_date)
      this.taskService.save(e)
      .then((savedTask) => {
        this.isLoading = false
      })
      .catch(e => {
        this.handleErrors(isValid.message)
        this.isLoading = false
      })
    }else{
      this.handleErrors(isValid.message)
      this.isLoading = false
    }
  }

}
