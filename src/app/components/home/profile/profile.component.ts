import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../dto/user';
import { empty, mergeMap, Observable, of, Subscription } from 'rxjs';
import { ImageService } from '../../../services/image.service';
import { ImageResponse } from '../../../dto/image-response';
import { Role } from '../../../dto/role';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnChanges, OnDestroy {

  constructor(
    private userService: UserService,
    private imageService: ImageService,
  ) {}

  @Input() user?: User
  subscriptions: Subscription[] = []
  selectedFile?: File
  selectedImage: string | ArrayBuffer = ''
  edit: boolean = false
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.user && this.user.image)
      this.selectedImage = 'http://localhost:8181/api/image/' + this.user.image
  }

  onImageSelected(event :any) {
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

  uploadImage(): Observable<ImageResponse> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      return this.imageService.uploadImage(formData)
    }
    else if(this.user) {
      const image: ImageResponse = {name: this.user.image.toString()}
      return of(image);
    }
    return new Observable();
  }

  saveEdit() {
    const sub = this.uploadImage().pipe(mergeMap(res => this.userService.editUser({
      firstname: this.user!.firstname,
      lastname: this.user!.lastname,
      email: this.user!.email,
      password: this.user!.password,
      image: res.name,
      role: Role.USER
    }))).subscribe({
      next: () => this.edit = false
    })
    this.subscriptions.push(sub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
