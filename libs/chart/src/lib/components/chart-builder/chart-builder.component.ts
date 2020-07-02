import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  BarChartModel,
} from '../../models/bar-chart.model';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InternalChartParams } from '../../classes/internal-chart-params.class';

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
  @ViewChild('xLabels') xLabels: ElementRef;
  @ViewChild('dataSet') dataSetElement: ElementRef;

  @Input() set dataSet(data: BarChartModel[]) {
    this.chartData = data;
    this.internalChartParams.setMaxChartData(data);
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
        this.removeDrawnItems();
        this.drawChart();
      })
    )
  }

  private drawChart() {
    const element = this.elementView.nativeElement;
    this.internalChartParams.init(element.offsetWidth, element.offsetHeight);
    this.changeDetectorRef.detectChanges();
    this.drawYTicks();
    this.drawXTicks();
    this.drawBars();
  }

  private drawYTicks() {
    const modifier = this.internalChartParams.axis.y.max / this.internalChartParams.axis.y.ticksCount;
    Array(this.internalChartParams.axis.y.ticksCount).fill(null).forEach((_, i) => {
      const value = this.internalChartParams.axis.y.max - modifier * i
      const textElement = this.renderer.createElement('text', 'svg');
      const textElementText = this.renderer.createText(value.toString(10));

      this.renderer.setAttribute(textElement, 'x', this.internalChartParams.axisLabels.y.left.toString(10))
      this.renderer.setAttribute(textElement, 'y', this.internalChartParams.calculateYCoordinate(value).toString(10))

      this.renderer.appendChild(textElement, textElementText);
      this.renderer.appendChild(this.yLabels.nativeElement, textElement);
    })
  }

  private drawXTicks() {
    const modifier = this.internalChartParams.lengthOfXAxis / this.chartData.length;
    this.chartData.forEach((item, i) => {
      const textElement = this.renderer.createElement('text', 'svg');
      const container = this.renderer.createElement('g', 'svg');
      const textElementText = this.renderer.createText(item.title);
      const value = modifier * i + this.internalChartParams.axisLabels.x.left
      this.renderer.setAttribute(textElement, 'x', value.toString(10))
      this.renderer.setAttribute(textElement, 'y', this.xAxisTextYCoordinate.toString(10))

      // set exactly to the center of the bar
      this.renderer.setAttribute(textElement, 'transform', `translate(${this.internalChartParams.bars.width / 2}, 0)`)
      this.renderer.setAttribute(textElement, 'text-anchor', `middle`)
      this.renderer.appendChild(textElement, textElementText);
      this.renderer.appendChild(container, textElement);
      this.renderer.appendChild(this.xLabels.nativeElement, container);
    })
  }

  private drawBars() {
    const modifier = this.internalChartParams.lengthOfXAxis / this.chartData.length;
    this.chartData.forEach((item, i) => {
      const container = this.renderer.createElement('g', 'svg');
      const xValue = modifier * i + this.internalChartParams.axisLabels.x.left
      const barElement = this.createBarLine(xValue, item);
      const textElementText = this.createBarLineText(xValue, item)
      this.renderer.appendChild(container, barElement);
      this.renderer.appendChild(container, textElementText);
      this.renderer.appendChild(this.dataSetElement.nativeElement, container);
    })
  }

  private createBarLine(xValue: number, item: BarChartModel) {
    const barElement = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(barElement, 'x', xValue.toString(10))
    this.renderer.setAttribute(barElement, 'y', this.internalChartParams.calculateYCoordinate(item.value).toString(10))
    this.renderer.setAttribute(barElement, 'width', this.internalChartParams.bars.width.toString(10))
    this.renderer.setAttribute(barElement, 'height', this.internalChartParams.calculateHeightForYInPX(item.value).toString(10))
    return barElement;
  }

  private createBarLineText(xValue: number, item: BarChartModel) {
    const textElement = this.renderer.createElement('text', 'svg');
    this.renderer.setAttribute(textElement, 'x', xValue.toString(10));

    const y = this.internalChartParams.calculateYCoordinate(item.value) - this.internalChartParams.bars.titleOffset;
    this.renderer.setAttribute(textElement, 'y', y.toString(10));
    this.renderer.setAttribute(textElement, 'transform', `translate(${this.internalChartParams.bars.width / 2}, 0)`)
    this.renderer.setAttribute(textElement, 'text-anchor', `middle`)
    const textElementText = this.renderer.createText(item.value.toString(10));
    this.renderer.appendChild(textElement, textElementText);
    return textElement;
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
    return this.yAxisYCoordinate + this.internalChartParams.axisLabels.x.top;
  }

  get xAxisTitleYCoordinate(): number {
    return this.xAxisTextYCoordinate + this.internalChartParams.axisLabels.x.title;
  }

  get xAxisTitleXCoordinate(): number {
    return this.internalChartParams.lengthOfXAxis - 50;
  }

  get xAxisTranslate(): string {
    return `translate(${this.internalChartParams.axis.x.left},0)`
  }

  removeDrawnItems() {
    this.removeChild(this.dataSetElement);
    this.removeChild(this.xLabels)
    this.removeChild(this.yLabels)
  }

  removeChild(element) {
    console.log(element.nativeElement);
    const el = element.nativeElement
    while(el.firstChild) {
      this.renderer.removeChild(el, el.lastChild);
    }
  }
}
