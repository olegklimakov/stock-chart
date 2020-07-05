import { ChartAxisSettings, ChartBarSettings } from '../models/bar-chart.model';

export class BarsClass {
  constructor(
    public settings: ChartBarSettings
  ) {}

  get width(): number {
    return this.settings.width || 0;
  }

  get color(): string {
    return this.settings.color;
  }

  get titleOffset(): number {
    return this.settings.titleOffset || 0;
  }
}
