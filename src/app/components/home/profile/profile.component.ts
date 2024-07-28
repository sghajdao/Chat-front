import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../dto/user';
import { mergeMap, Observable, of, Subscription } from 'rxjs';
import { ImageService } from '../../../services/image.service';
import { ImageResponse } from '../../../dto/image-response';
import { Role } from '../../../dto/role';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnChanges, OnDestroy {

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private chatService: ChatService,
  ) {}

  @Input() profile?: User
  @Input() user?: User
  @Output() newUser = new EventEmitter<User>()
  subscriptions: Subscription[] = []
  selectedFile?: File
  selectedImage: string | ArrayBuffer = ''
  edit: boolean = false
  email?: string | null
  block: boolean = false
  
  ngOnChanges(changes: SimpleChanges): void {
    this.email = this.userService.getEmail();
    if (this.profile && this.profile.image && this.user) {
      this.selectedImage = 'http://localhost:8181/api/image/' + this.profile.image
    }
    else if (this.profile && this.user)
      this.user.blackList?.includes(this.profile.id!)? this.block = true: this.block = false
    
  }

  onImageSelected(event :any) {
    if (this.userService.getEmail() === this.profile?.email) {
      this.selectedFile = (event.target.files[0]);
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImage = (e.target?.result!);
        };
        reader.readAsDataURL(this.selectedFile); 
        this.edit = true
      }
    }
  }

  uploadImage(): Observable<ImageResponse> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      return this.imageService.uploadImage(formData)
    }
    else if(this.profile) {
      const image: ImageResponse = {name: this.profile.image.toString()}
      return of(image);
    }
    return new Observable();
  }

  saveEdit() {
    const sub = this.uploadImage().pipe(mergeMap(res => this.userService.editUser({
      firstname: this.profile!.firstname,
      lastname: this.profile!.lastname,
      email: this.profile!.email,
      password: this.profile!.password,
      image: res.name,
      role: Role.USER,
    }))).subscribe({
      next: () => this.edit = false
    })
    this.subscriptions.push(sub)
  }

  blockUser() {
    const sub = this.userService.blockUser({user: this.user?.id!, block: this.profile?.id!}).subscribe({
      next: data => {this.block = true;this.newUser.emit(data);this.chatService.updateUser({user: this.user?.id!, block: this.profile?.id!})}
    })
    this.subscriptions.push(sub)
  }

  unblockUser() {
    const sub = this.userService.unblockUser({user: this.user?.id!, block: this.profile?.id!}).subscribe({
      next: data => {this.block = false;this.newUser.emit(data);this.chatService.updateUser({user: this.user?.id!, block: this.profile?.id!})}
    })
    this.subscriptions.push(sub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
