import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChartModule } from '@stock-chart/chart';
import { StockPageComponent } from './components/stock-page/stock-page.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { BittrexApiService } from './services/bittrex-api.service';
import { ApiAbstractService } from './services/api-abstract.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    // Polymorphism reason
    {
      provide: ApiAbstractService,
      useClass: BittrexApiService,
      deps: [HttpClient]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
