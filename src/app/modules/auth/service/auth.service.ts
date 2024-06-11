import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../../models/login-response.model';
import { urlConstants } from '../../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient
  ) { }


  login(request:LoginRequest):Observable<LoginResponse>
  {
    return this.http.post<LoginResponse>(urlConstants.Auth,request);
  }
  

}
