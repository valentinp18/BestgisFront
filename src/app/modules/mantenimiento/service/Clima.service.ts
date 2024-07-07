import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { ClimaRequest } from '../models/Clima-request.module';
import { ClimaResponse } from '../models/Clima-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ClimaService extends CrudService<ClimaRequest, ClimaResponse> {

  constructor(
    protected https: HttpClient,
  ) {
    super(https, firestoreConstants.Clima);
  }
}
  