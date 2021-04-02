import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from "@angular/forms"
import { UiSwitchModule } from 'ngx-toggle-switch';
import {NgxTypedJsModule} from 'ngx-typed-js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GanttComponent } from './components/gantt/gantt.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthService } from './services/auth.service';
import { GuardService } from './services/guard.service';
import { CompanyService } from './services/company.service';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';
import { MemberService } from './services/member.service';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ProjectViewComponent } from './components/project/project-view/project-view.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PricingComponent } from './components/pricing/pricing.component';
import { SharedService } from './services/shared.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, GanttComponent, NavbarComponent, LoginComponent, RegisterComponent, ProjectListComponent, LoaderComponent, ProjectViewComponent, PricingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiSwitchModule,
    FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot(), BrowserAnimationsModule,
    NgxTypedJsModule,
  ],
  providers: [
    AuthService, GuardService,SharedService,
    CompanyService,ProjectService,TaskService,LinkService,UserService,MemberService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
