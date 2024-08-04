import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ImageResponse } from '../models/dto/image-response';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadImage(image: FormData) {
    return this.http.post<ImageResponse>(environment.urlRequest + "image/upload", image, this.getHeaders());
  }

  getImage(name:(string | ArrayBuffer)) {
    return this.http.get(environment.urlRequest + 'image/' + name);
  }


  private getHeaders(){
    const accessToken = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${accessToken}` };
    return {headers};
  }
}
