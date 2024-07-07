import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { DroneRequest } from '../models/Drone-request.module';
import { DroneResponse } from '../models/Drone-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class DroneService extends CrudService<DroneRequest, DroneResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Drone);
  }
}
