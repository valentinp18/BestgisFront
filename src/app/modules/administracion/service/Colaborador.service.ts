import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { ColaboradorRequest } from '../models/Colaborador-request.module';
import { ColaboradorResponse } from '../models/Colaborador-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService extends CrudService<ColaboradorRequest, ColaboradorResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Colaborador);
  }
}
