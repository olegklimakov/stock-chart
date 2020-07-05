import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketPriceClass } from '../classes/market-price.class';
import { MarketData } from '../models/market.model';

export const mapToPriceClass = (): OperatorFunction<MarketData[], MarketPriceClass[]> => {
  return input$ => input$.pipe(
    map(data => data.map(item => new MarketPriceClass(item.price, item.name)))
  );
};
