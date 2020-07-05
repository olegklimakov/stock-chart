import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarChartModel } from '@stock-chart/chart';
import { FormControl } from '@angular/forms';
import { ApiAbstractService } from '../../services/api-abstract.service';
import { combineLatest, Subject } from 'rxjs';
import { MarketPriceClass } from '../../classes/market-price.class';
import { takeUntil } from 'rxjs/operators';
import { DefaultSelectedStocks } from '../../data/default-stocks';
import { handleAndSortStockData } from '../../operator-functions/handle-stock-items.operator';
import { mapToPriceClass } from '../../operator-functions/map-to-price-class.operator';

@Component({
  selector: 'stock-chart-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit, OnDestroy {
  chartData: BarChartModel[];

  stocks: MarketPriceClass[];
  private destroy$ = new Subject();

  selectedStocksControl = new FormControl();

  constructor(
    private api: ApiAbstractService
  ) { }

  ngOnInit(): void {
    this.initialGettingData();
    this.initialUpdateControl();
  }

  initialUpdateControl() {
    this.selectedStocksControl.patchValue(DefaultSelectedStocks);
  }


  initialGettingData() {
    combineLatest([
      this.api.getMarkets().pipe(mapToPriceClass()),
      this.selectedStocksControl.valueChanges,
    ]).pipe(
      handleAndSortStockData(),
      takeUntil(this.destroy$)
    ).subscribe(([selectData, chartData]) => {
      this.stocks = selectData;
      this.chartData = chartData;
    })
  }

  // Avoid memory leak
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
