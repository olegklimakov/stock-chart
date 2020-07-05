import { ChartAxisSettings } from '../models/bar-chart.model';

export class ChartAxis {
  constructor(
    public settings: ChartAxisSettings
  ) {}

  static ceilToTens(element: number): number {
    return Math.ceil(element / 10) * 10;
  }

  get left(): number {
    return this.settings.leftOffset || 0;
  }

  get right(): number {
    return this.settings.rightOffset || 0;
  }

  get bottom(): number {
    return this.settings.bottomOffset || 0;
  }

  get top(): number {
    return this.settings.topOffset || 0;
  }

  get max(): number {
    return this.settings.maxValue || 0;
  }

  set max(data: number) {
    this.settings.maxValue = ChartAxis.ceilToTens(data);
  }

  get ticksCount(): number {
    return this.settings.ticksNumber;
  }
}
