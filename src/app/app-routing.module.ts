import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProjectViewComponent } from './components/project/project-view/project-view.component';
import { PricingComponent } from './components/pricing/pricing.component';


const routes: Routes = [
  { path: "", component : HomeComponent },
  { path : "login", component : LoginComponent },
  { path : "register", component : RegisterComponent },
  { path : "project/:id", component : ProjectViewComponent },
  { path : "pricing", component : PricingComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
