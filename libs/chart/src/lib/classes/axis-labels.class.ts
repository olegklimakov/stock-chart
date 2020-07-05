import { ChartAxisLabelsSettings } from '../models/bar-chart.model';

export class ChartAxisLabels {
  constructor(public settings: ChartAxisLabelsSettings) {}

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

  get title(): number {
    return this.settings.titleOffset || 0;
  }
}

