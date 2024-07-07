import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { CultivoRequest } from '../models/Cultivo-request.module';
import { CultivoResponse } from '../models/Cultivo-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CultivoService extends CrudService<CultivoRequest, CultivoResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Cultivo);
  }
}
