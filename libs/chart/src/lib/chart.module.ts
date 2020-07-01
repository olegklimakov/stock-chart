import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartBuilderComponent } from './components/chart-builder/chart-builder.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ChartBuilderComponent],
  exports: [
    ChartBuilderComponent
  ]
})
export class ChartModule {}
