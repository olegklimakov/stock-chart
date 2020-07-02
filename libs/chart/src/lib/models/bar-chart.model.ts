export interface BarChartModel {
  value: number;
  title: string;
}

export interface ChartAxisSettings {
  leftOffset: number;
  rightOffset: number;
  bottomOffset: number;
  topOffset: number;
  maxValue?: number;
  ticksNumber?: number;
}

export interface ChartAxisLabelsSettings {
  leftOffset?: number;
  rightOffset?: number;
  bottomOffset?: number;
  topOffset?: number;
  titleOffset?: number;
}

export interface ChartBarSettings {
  width: number;
  titleOffset?: number;
  color?: string;
}
