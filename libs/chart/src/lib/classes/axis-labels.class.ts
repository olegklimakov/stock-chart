import { ChartAxisLabelsSettings } from '../models/bar-chart.model';

export class ChartAxisLabels {
  constructor(public settings: ChartAxisLabelsSettings) {}

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
}

