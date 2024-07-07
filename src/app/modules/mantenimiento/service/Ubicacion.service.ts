import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { UbicacionRequest } from '../models/Ubicacion-request.module';
import { UbicacionResponse } from '../models/Ubicacion-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService extends CrudService<UbicacionRequest, UbicacionResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Ubicacion);
  }
}
