import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firestoreConstants } from '../../../../app/constants/firestore.constants';
import { ProductoRequest } from '../models/Producto-request.module';
import { ProductoResponse } from '../models/Producto-response.module';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends CrudService<ProductoRequest, ProductoResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, firestoreConstants.Producto);
  }
}
