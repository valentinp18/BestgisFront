import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { RolRequest } from '../models/Rol-request.module';
import { RolResponse } from '../models/Rol-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class RolService extends CrudService<RolRequest, RolResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Rol);
  }
}
