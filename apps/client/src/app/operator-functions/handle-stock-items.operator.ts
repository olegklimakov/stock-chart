import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketPriceClass } from '../classes/market-price.class';
import { BarChartModel } from '@stock-chart/chart';

export const handleAndSortStockData = (): OperatorFunction<[MarketPriceClass[], string[]], [MarketPriceClass[], BarChartModel[]]> => {
  return input$ => input$.pipe(
      map(([all, selected]) => {
        const chartData = [];
        all.forEach(stock => {
          // add selected flag if it is in selected array
          if(!!selected.some(stockName => stockName === stock.name)) {
            stock.isSelected = true;
            chartData.push({ value: stock.price, title: stock.name })
          } else {
            stock.isSelected = false;
          }
        })
        all.sort(sortItems);
        return [all, chartData];
      })
      );
};

// selected items should be on the top level
const sortItems = (a: MarketPriceClass, b: MarketPriceClass) => {
  if (a.isSelected && b.isSelected)  {
    return 0;
  }
  if (a.isSelected && !b.isSelected)  {
    return -1;
  }
  if (!a.isSelected && b.isSelected)  {
    return 1;
  }
}

