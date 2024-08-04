import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversationBodyComponent } from './conversation-body/conversation-body.component';
import { ConversationsListComponent } from './conversations-list/conversations-list.component';
import { ProfileComponent } from './profile/profile.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AllUsersComponent } from '../all-users/all-users.component';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [
    HomeComponent,
    ConversationBodyComponent,
    ConversationsListComponent,
    ProfileComponent,
    AllUsersComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule, MatDividerModule, MatIconModule,
    MatTooltipModule, MatMenuModule
  ]
})
export class HomeModule { }
