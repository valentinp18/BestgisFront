import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { HistorialRequest } from '../models/Historial-request.module';
import { HistorialResponse } from '../models/Historial-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialService extends CrudService<HistorialRequest, HistorialResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Historial);
  }
}
