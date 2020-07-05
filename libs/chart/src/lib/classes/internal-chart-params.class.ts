import { ChartAxis } from './axis.class';
import { ChartAxisLabels } from './axis-labels.class';
import { BarsClass } from './bars.class';
import { BarChartModel } from '@stock-chart/chart';

export class InternalChartParams {
  container: {
    height: number;
    width: number;
  }

  axis: {
    x: ChartAxis;
    y: ChartAxis;
  }

  axisLabels: {
    x: ChartAxisLabels;
    y: ChartAxisLabels;
  }

  bars: BarsClass

  viewInit = false;
  hasData = false;

  maxYValue: number;
  pixelsPerValueY: number;
  lengthOfYAxis: number;
  lengthOfXAxis: number;

  constructor() {
    this.container = {
      height: 0,
      width: 0,
    }

    this.bars = new BarsClass({
      width: 80,
      titleOffset: 5
    })

    this.axisLabels = {
      x: new ChartAxisLabels({
        titleOffset: 20,
        rightOffset: 20,
        leftOffset: 20,
        topOffset: 15,
      }),
      y: new ChartAxisLabels({
        leftOffset: 80
      }),
    }

    this.axis = {
      x: new ChartAxis({
        leftOffset: 90,
        rightOffset: 0,
        bottomOffset: 5,
        topOffset: 10,
      }),
      y: new ChartAxis({
        leftOffset: 90,
        rightOffset: 0,
        bottomOffset: 50,
        topOffset: 30,
        ticksNumber: 5,
      }),
    }
  }

  static findMaxValueInArray(array: BarChartModel[]) {
    return Math.max.apply(Math, array.map((item) => item.value));
  }

  setMaxChartData(array: BarChartModel[]) {
    this.maxYValue = InternalChartParams.findMaxValueInArray(array);
    this.axis.y.max = this.maxYValue;
  }


  private calculateLengthOfYAxis(): number {
    return this.container.height
      - this.axis.y.bottom
      - this.axis.y.top
  };

  private calculateLengthOfXAxis(): number {
    return this.container.width
      - this.axisLabels.x.left
      - this.axisLabels.x.right
      - this.axis.x.left
      - this.axis.x.right
  };

  private calculateValuesPerPixelY(yLength): number {
    return yLength / this.axis.y.max
  }

  init(width: number, height: number) {
    this.container.width = width;
    this.container.height = height;
    this.viewInit = true;
    this.reCalculateLengths();
  }

  reCalculateLengths() {
    this.lengthOfYAxis = this.calculateLengthOfYAxis();
    this.lengthOfXAxis = this.calculateLengthOfXAxis();
    this.pixelsPerValueY = this.calculateValuesPerPixelY(this.lengthOfYAxis) || 0;
  }

  calculateYCoordinate(value: number) {
    return this.lengthOfYAxis - this.calculateHeightForYInPX(value) + this.axis.y.top;
  }

  calculateHeightForYInPX(value: number) {
    // prevent empty chart errors
    if(!value) { return 0 }
    return this.pixelsPerValueY * value;
  }
}

