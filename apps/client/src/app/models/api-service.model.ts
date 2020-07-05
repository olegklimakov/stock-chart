import { Observable } from 'rxjs';
import { MarketData } from './market.model';

export interface StockApiService {
  getMarkets(): Observable<MarketData[]>;
}
