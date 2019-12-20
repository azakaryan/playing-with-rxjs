import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InitialCounterComponent} from "./components/initial-counter/initial-counter.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RxjsBasedCounterComponent} from "./components/rxjs-based-counter/rxjs-based-counter.component";
import {RxjsCqrsBasedCounterComponent} from "./components/rxjs-cqrs-based-counter/rxjs-cqrs-based-counter.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'initial-counter',
    component: InitialCounterComponent,
  },
  {
    path: 'rxjs-based-counter',
    component: RxjsBasedCounterComponent,
  },
  {
    path: 'rxjs-cqrs-based-counter',
    component: RxjsCqrsBasedCounterComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
