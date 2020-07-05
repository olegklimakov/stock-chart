import { Injectable } from '@angular/core';
import { StockApiService } from '../models/api-service.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MarketData } from '../models/market.model';

@Injectable()
export class ApiAbstractService implements StockApiService {
  constructor(public http: HttpClient) {}

  getMarkets(): Observable<MarketData[]> {
    return of([null])
  }
}
