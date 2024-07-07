import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { UsuarioRequest } from '../models/Usuario-request.module';
import { UsuarioResponse } from '../models/Usuario-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CrudService<UsuarioRequest, UsuarioResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Usuario);
  }
}
