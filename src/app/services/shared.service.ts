import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable()
export class SharedService{
   
   private taskSource = new BehaviorSubject<Task>(null)
   taskObservable = this.taskSource.asObservable()

   setTask(task : Task){
      console.log("Selected")
      this.taskSource.next(task)
   }

   constructor(){}



}