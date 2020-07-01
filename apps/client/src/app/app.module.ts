import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartModule } from '@stock-chart/chart';
import { StockPageComponent } from './components/stock-page/stock-page.component';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: StockPageComponent,
  }
]

@NgModule({
  declarations: [
    AppComponent,
    StockPageComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
