import { ChartAxisSettings } from '../models/bar-chart.model';

export class ChartAxis {
  constructor(
    public settings: ChartAxisSettings
  ) {}

  static ceilToTens(element: number): number {
    return Math.ceil(element / 10) * 10;
  }

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

  get max(): number {
    return this.settings.maxValue;
  }

  set max(data: number) {
    this.settings.maxValue = ChartAxis.ceilToTens(data);
  }

  get ticksCount(): number {
    return this.settings.ticksNumber;
  }
}
