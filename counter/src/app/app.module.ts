import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatInputModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import { InitialCounterComponent } from './components/initial-counter/initial-counter.component';
import {AppRoutingModule} from "./app-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RxjsBasedCounterComponent } from './components/rxjs-based-counter/rxjs-based-counter.component';
import { RxjsCqrsBasedCounterComponent } from './components/rxjs-cqrs-based-counter/rxjs-cqrs-based-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialCounterComponent,
    DashboardComponent,
    RxjsBasedCounterComponent,
    RxjsCqrsBasedCounterComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
