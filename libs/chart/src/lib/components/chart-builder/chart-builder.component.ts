import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input, OnDestroy,
  OnInit, Renderer2,
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
  lengthOfYAxis: number;

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
  @ViewChild('yLabels') yLabels: ElementRef;
  @Input() set dataSet(data: BarChartModel[]) {
    this.chartData = data;
    console.log(data);
    this.internalChartParams.maxYValue = this.findMaxValueInArray(data);
    this.internalChartParams.axis.y.settings.maxValue = this.ceilToTens(this.internalChartParams.maxYValue);
  };

  subscriptions: Subscription[] = []

  internalChartParams: InternalChartParams = new InternalChartParams();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2
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
    // if(!this.internalChartParams.viewInit) { return }
    const element = this.elementView.nativeElement;
    this.internalChartParams.init(element.offsetWidth, element.offsetHeight);
    this.internalChartParams.lengthOfYAxis = this.calculateLengthOfYAxis();
    this.internalChartParams.pixelsPerValueY = this.calculateValuesPerPixelY(this.internalChartParams.lengthOfYAxis);
    console.log(this.internalChartParams.pixelsPerValueY);
    this.changeDetectorRef.detectChanges();
    this.drawYTicks();
    // this.changeDetectorRef.detectChanges();
  }

  private drawYTicks() {

    /*
    <text
        [attr.x]="internalChartParams.axis.y.labelsX"
        [attr.y]="internalChartParams.axis.y.top"
      >
        {{internalChartParams.axis.y.max}}
      </text>
     */
    const modifier = this.internalChartParams.axis.y.max / this.internalChartParams.axis.y.ticksCount;
    Array(this.internalChartParams.axis.y.ticksCount).fill(null).forEach((_, i) => {
      const value = this.internalChartParams.axis.y.max - modifier * i
      console.log(value);
      const textElement = this.renderer.createElement('text', 'svg');
      const textElementText = this.renderer.createText(value.toString(10));
      this.renderer.setAttribute(textElement, 'x', this.internalChartParams.axis.y.labelsX.toString(10))
      this.renderer.setAttribute(textElement, 'y', this.calculateYCoordinate(value).toString(10))
      this.renderer.appendChild(textElement, textElementText);
      this.renderer.appendChild(this.yLabels.nativeElement, textElement);
    })
  }

  private calculateYCoordinate(value: number) {
    return this.internalChartParams.lengthOfYAxis - this.internalChartParams.pixelsPerValueY * value + this.internalChartParams.axis.y.top;
  }

  findMaxValueInArray(array: BarChartModel[]) {
    return Math.max.apply(Math, array.map((item) => item.value));
  }

  ceilToTens(element: number) {
    return Math.ceil(element / 10) * 10;
  }

  calculateLengthOfYAxis(): number {
    // this.internalChartParams.container.height - this.yAxisYCoordinate + this.internalChartParams.axis.y.top
    return this.internalChartParams.container.height - this.internalChartParams.axis.y.bottom - this.internalChartParams.axis.y.top
  };

  calculateValuesPerPixelY(yLength) {
    return yLength  / this.internalChartParams.axis.y.max
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
