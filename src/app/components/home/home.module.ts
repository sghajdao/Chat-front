import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversationBodyComponent } from './conversation-body/conversation-body.component';
import { ConversationsListComponent } from './conversations-list/conversations-list.component';


@NgModule({
  declarations: [
    HomeComponent,
    ConversationBodyComponent,
    ConversationsListComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
