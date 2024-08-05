import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '../../guards/auth.guard';
import { verifiedEmailGuard } from '../../guards/verify-email.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard, verifiedEmailGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
