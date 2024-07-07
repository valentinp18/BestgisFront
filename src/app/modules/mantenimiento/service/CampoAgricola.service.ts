import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { CampoAgricolaRequest } from '../models/CampoAgricola-request.module';
import { CampoAgricolaResponse } from '../models/CampoAgricola-response.module';
import { CrudService } from '../../shared/services/crud.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CampoAgricolaService extends CrudService<CampoAgricolaRequest, CampoAgricolaResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.CampoAgricola);
  }
  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(firestoreConstants.Ubicacion);  // Asegúrate de que esta URL sea la correcta
  }
}
