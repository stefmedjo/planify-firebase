import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import "dhtmlx-gantt";
//import 'dhtmlx-gantt/codebase/locale/locale_fr.js';
import { TaskService } from 'src/app/services/task.service';
import { LinkService } from 'src/app/services/link.service';
import { ProjectService } from 'src/app/services/project.service';
import { Task } from 'src/app/models/task.model';
import { Link } from 'src/app/models/link.model';
import { Project } from 'src/app/models/project.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
declare var $ : any
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'gantt',
    styleUrls: ['./gantt.component.css'],
    providers: [TaskService, LinkService],
    templateUrl: `./gantt.component.html`,
})

export class GanttComponent implements OnInit {
    @ViewChild("gantt_here",{static : true}) ganttContainer: ElementRef;
    @Input("project_id") project_id : string
    @Input("project") project : Project

    tasks : Task[] = []
    links : Link[] = []
    deleteForm : FormGroup

    constructor(
        private taskService : TaskService,
        private linkService : LinkService,
        private projectService : ProjectService,
        private userService : UserService,
        private builder : FormBuilder,
        private sharedService : SharedService
    ){
        this.deleteForm = this.builder.group({
            id : ['']
        })
    }

    ngOnInit(){
        
        this.taskService.collection.orderBy("created_on","asc").onSnapshot((datas : firebase.firestore.QuerySnapshot) => {
            datas.docChanges().forEach((data : firebase.firestore.DocumentChange) => {
                if(data.type == "added"){
                    const task = new Task()
                    task.set(data.doc)
                    if(![null,""].includes(task.managed_by)){
                        this.userService.findOneById(task.managed_by)
                        .then((data) =>{
                            if(data != null){
                                const user = new User()
                                user.set(data)
                                task.manager = user
                            }
                        })
                    }
                    this.tasks.push(task)

                    gantt.addTask(task,"");
                }else if(data.type == "modified"){
                    const task = new Task()
                    task.set(data.doc)
                    gantt.getTask(task.id)
                    gantt.refreshData()
                    for(let i = 0; i < this.tasks.length; i++){
                        if(this.tasks[i].id == task.id){
                            this.tasks[i] = task
                            break
                        }
                    }
                }else if(data.type == "removed"){
                    gantt.deleteTask(data.doc.id)
                    for(let i = 0; i < this.tasks.length; i++){
                        if(this.tasks[i].id == data.doc.id){
                            this.tasks.splice(i,1)
                            break
                        }
                    }
                }
            })
        })

        this.linkService.collection.onSnapshot((datas : firebase.firestore.QuerySnapshot) => {
            datas.docChanges().forEach((data : firebase.firestore.DocumentChange) => {
                if(data.type == "added"){                    
                    const link = new Link()
                    link.set(data.doc)
                    gantt.addLink(link)
                    this.links.push(link)                    
                }else if(data.type == "modified"){
                    const link = new Link()
                    link.set(data.doc)
                    const _links = gantt.config.links
                    let _link = gantt.getLink(link.id)
                    _link = link
                    gantt.refreshData()
                }else{
                    gantt.deleteLink(data.doc.id)
                }
            })
        })
        
        gantt.config.xml_date = "%Y-%m-%d %H:%i"
        gantt.config.fit_tasks = true;
        gantt.config.columns = [
            {name: "text", width: "*", tree: true, resize: true},
            {name: "start_date", align: "center", label: "Start", resize: true},
            {name: "end_date", align: "center", label: "End", resize: true},
          ]
          gantt.config.min_grid_column_width = 20;
        gantt.config.layout = {
            css: "gantt_container",
            rows:[
                {
                   cols: [
                    {
                      // the default grid view  
                      view: "grid",  
                      scrollX:"scrollHor", 
                      scrollY:"scrollVer"
                    },
                    { resizer: true, width: 1 },
                    {
                      // the default timeline view
                      view: "timeline", 
                      scrollX:"scrollHor", 
                      scrollY:"scrollVer"
                    },
                    {
                      view: "scrollbar", 
                      id:"scrollVer"
                    }
                ]},
                {
                    view: "scrollbar", 
                    id:"scrollHor"
                }
            ]
        }
        let _this = this
        
        gantt.attachEvent("onTaskClick",function(id,item){
            const task = _this.tasks.filter(task => task.id == id)
            _this.sharedService.setTask(task[0])
            return true
        })

        gantt.attachEvent("onLinkCreated", function(id,item){
            const _link_ = new Link()
            _link_.project_id = _this.project.id
            _link_.company_id = _this.project.company_id
            _link_.source = item.source
            _link_.target = item.target
            _link_.type = item.type
            _this.linkService.save(_link_)
            .then(() => {
                return
            })
            .catch((err) => {
                _this.handleErrors(err.message)
            })
        });
        

        gantt.attachEvent("onLinkDblClick", function(id,e){
            console.log(id)
            _this.deleteForm.controls["id"].setValue(id)
            $('#delete-link').modal("show")
        });
        
        
        
        gantt.init(this.ganttContainer.nativeElement);
        gantt.parse({ data : this.tasks, links : this.links })



    }

    handleErrors(text : string){
        alert(text)
    }

    submitDeleteLink(){
        $('#delete-link').modal("hide")
        const id = this.deleteForm.value.id
        this.linkService.removeById(id)
        .then(() => {
            console.log("supprimé")
        })
        .catch(err => {
            this.handleErrors(err.message)
        })
    }

}