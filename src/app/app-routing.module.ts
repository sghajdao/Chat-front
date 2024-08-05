import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren:()=>import("./components/home/home.module").then(m=>m.HomeModule),
  },
  {
    path: "auth",
    loadChildren:()=>import("./components/auth/auth.module").then(m=>m.AuthModule),
  },
  {
    path: "verify-email",
    loadChildren:()=>import("./components/verify-email/verify-email.module").then(m=>m.VerifyEmailModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
