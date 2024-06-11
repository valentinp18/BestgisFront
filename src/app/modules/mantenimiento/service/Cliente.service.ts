import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from '../../../../app/constants/url.constants';
import { ClienteRequest } from '../models/Cliente-request.module';
import { ClienteResponse } from '../models/Cliente-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<ClienteRequest, ClienteResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, urlConstants.Cliente);
  }
}
