import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketData, MarketResponse } from '../models/market.model';
import { map } from 'rxjs/operators';
import { StockApiService } from '../models/api-service.model';
import { ApiAbstractService } from './api-abstract.service';

@Injectable({
  providedIn: 'root'
})
export class BittrexApiService implements StockApiService {

  constructor(
    public http: HttpClient
  ) {}

  getMarkets(): Observable<MarketData[]> {
    return this.http.get<MarketResponse>('/api/getmarketsummaries').pipe(
      map(response => response.result.map(item => ({ name: item.MarketName, price: item.Last})))
    );
  }
}
