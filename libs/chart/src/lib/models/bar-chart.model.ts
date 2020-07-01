export interface BarChartModel {
  value: number;
  title: string;
}

export interface ChartAxisSettings {
  leftOffset: number,
  rightOffset: number,
  bottomOffset: number,
  topOffset: number,
  titleOffset?: number,
  maxValue?: number,
  ticksNumber?: number,
}
