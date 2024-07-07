import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { ResultadoAnalisiRequest } from '../models/ResultadoAnalisi-request.module';
import { ResultadoAnalisiResponse } from '../models/ResultadoAnalisi-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ResultadoAnalisiService extends CrudService<ResultadoAnalisiRequest, ResultadoAnalisiResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.ResultadoAnalisis);
  }
}
