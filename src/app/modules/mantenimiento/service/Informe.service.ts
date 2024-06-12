import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from '../../../../app/constants/url.constants';
import { InformeRequest } from '../models/Informe-request.module';
import { InformeResponse } from '../models/Informe-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class InformeService extends CrudService<InformeRequest, InformeResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, urlConstants.Informe);
  }
}
