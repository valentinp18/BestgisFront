import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from '../../../../app/constants/url.constants';
import { MisionRequest } from '../models/Mision-request.module';
import { MisionResponse } from '../models/Mision-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class MisionService extends CrudService<MisionRequest, MisionResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, urlConstants.Mision);
  }
}
