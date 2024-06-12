import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlConstants } from '../../../../app/constants/url.constants';
import { CampoAgricolaRequest } from '../models/CampoAgricola-request.module';
import { CampoAgricolaResponse } from '../models/CampoAgricola-response.module';
import { CrudService } from '../../shared/services/crud.service';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
>>>>>>> 7c915c89e0944f73fdeb5cab06adf7f136ab0fca

@Injectable({
  providedIn: 'root'
})
export class CampoAgricolaService extends CrudService<CampoAgricolaRequest, CampoAgricolaResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, urlConstants.CampoAgricola);
  }
<<<<<<< HEAD

  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(urlConstants.Ubicacion);  // Asegúrate de que esta URL sea la correcta
  }
=======
>>>>>>> 7c915c89e0944f73fdeb5cab06adf7f136ab0fca
}
