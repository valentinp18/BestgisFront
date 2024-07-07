import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { EvidenciaRequest } from '../models/Evidencia-request.module';
import { EvidenciaResponse } from '../models/Evidencia-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService extends CrudService<EvidenciaRequest, EvidenciaResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Evidencia);
  }
}
