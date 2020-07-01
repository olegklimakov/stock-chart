import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BarChartModel, ChartAxisSettings } from '../../models/bar-chart.model';
import { fromEvent, Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

class ChartAxis {
  constructor(
    public settings: ChartAxisSettings
  ) {}

  get left(): number {
    return this.settings.leftOffset;
  }

  get right(): number {
    return this.settings.rightOffset;
  }

  get bottom(): number {
    return this.settings.bottomOffset;
  }

  get top(): number {
    return this.settings.topOffset;
  }

  get title(): number {
    return this.settings.titleOffset;
  }

  get max(): number {
    return this.settings.maxValue;
  }

  get ticksCount(): number {
    return this.settings.ticksNumber;
  }

  get labelsX(): number {
    return this.left - 10;
  }
}

class InternalChartParams {
  container: {
    height: number;
    width: number;
  }

  axis: {
    x: ChartAxis;
    y: ChartAxis;
  }

  viewInit = false;
  maxYValue: number;
  pixelsPerValueY: number;

  constructor() {
    this.container = {
      height: 0,
      width: 0,
    }

    this.axis = {
      x: new ChartAxis({
        leftOffset: 90,
        rightOffset: 0,
        bottomOffset: 5,
        topOffset: 10,
      }),
      // y: new ChartAxis(90, 0, 30, 0, 20),
      y: new ChartAxis({
        leftOffset: 90,
        rightOffset: 0,
        bottomOffset: 30,
        topOffset: 28,
        titleOffset: 20,
        ticksNumber: 5,
      }),
    }
  }

  init(width: number, height: number) {
    console.log(width, height);
    this.container.width = width;
    this.container.height = height;
    this.viewInit = true;
  }
}



@Component({
  selector: 'stock-chart-builder',
  templateUrl: './chart-builder.component.html',
  styleUrls: ['./chart-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  private chartData: BarChartModel[];
  @ViewChild('container') elementView: ElementRef;
  @Input() set dataSet(data: BarChartModel[]) {
    this.chartData = data;
    console.log(data);
    this.internalChartParams.maxYValue = this.findMaxValueInArray(data);
    this.internalChartParams.axis.y.settings.maxValue = this.ceilToTens(this.internalChartParams.maxYValue);
    this.internalChartParams.pixelsPerValueY = this.calculateValuesPerPixelY();
    console.log(this.internalChartParams.pixelsPerValueY);
  };

  subscriptions: Subscription[] = []

  internalChartParams: InternalChartParams = new InternalChartParams();

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.handleWindowResize();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  private handleWindowResize() {
    this.subscriptions.push(
      fromEvent(window, 'resize').pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.drawChart();
      })
    )
  }

  private drawChart() {
    const element = this.elementView.nativeElement;
    this.internalChartParams.init(element.offsetWidth, element.offsetHeight);
    this.internalChartParams.pixelsPerValueY = this.calculateValuesPerPixelY();
    console.log(this.internalChartParams.pixelsPerValueY);
    this.changeDetectorRef.detectChanges();
  }

  findMaxValueInArray(array: BarChartModel[]) {
    return Math.max.apply(Math, array.map((item) => item.value));
  }

  ceilToTens(element: number) {
    return Math.ceil(element / 10) * 10;
  }

  calculateValuesPerPixelY() {
    return this.internalChartParams.container.height /
      (
        // offset for bottom chart part (till 0y value) and top offset
        this.internalChartParams.axis.y.max - this.yAxisYCoordinate + this.internalChartParams.axis.y.top
      )
  }

  // Method for calculate bottom y coordinate for chart;
  get yAxisYCoordinate(): number {
    const totalHeight = this.internalChartParams.container.height;
    const bottomOffset = this.internalChartParams.axis.y.bottom;
    return totalHeight - bottomOffset;
  }

  get xAxisXCoordinate(): number {
    return this.internalChartParams.axis.x.left
  }

  get xAxisTextYCoordinate(): number {
    return this.yAxisYCoordinate + this.internalChartParams.axis.y.title;
  }

  get xAxisTitleYCoordinate(): number {
    return this.xAxisTextYCoordinate + 10
  }

  get xAxisTitleXCoordinate(): number {
    return this.internalChartParams.container.width - 50;
  }
}
