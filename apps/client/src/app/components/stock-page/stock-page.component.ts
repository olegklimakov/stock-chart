import { Component, OnInit } from '@angular/core';
import { BarChartModel } from '../../../../../../libs/chart/src/lib/models/bar-chart.model';

@Component({
  selector: 'stock-chart-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit {
  chartData: BarChartModel[] = [
    {
      value: 1000,
      title: 'Some 345'
    },
    {
      value: 1200,
      title: 'Some 123'
    },
    {
      value: 100,
      title: 'Some title'
    },
    {
      value: 1000,
      title: 'Some data'
    },
    {
      value: 1234,
      title: 'Some idk'
    },
    {
      value: 434.45,
      title: 'Some test'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }



}
