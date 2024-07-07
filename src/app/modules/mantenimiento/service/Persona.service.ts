import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { PersonaRequest } from '../models/Persona-request.module';
import { PersonaResponse } from '../models/Persona-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends CrudService<PersonaRequest, PersonaResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Persona);
  }
}
