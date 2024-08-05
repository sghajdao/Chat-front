import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyEmailRoutingModule } from './verify-email-routing.module';
import { VerifyEmailComponent } from './verify-email.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    VerifyEmailRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class VerifyEmailModule { }
